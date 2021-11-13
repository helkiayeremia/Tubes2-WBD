const { promisify } = require('util');
const { User } = require('../models/model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const user = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user || !(await user.validPassword(password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // Verification success
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user exist
  const currentUser = await User.findOne({
    where: {
      id: decoded.id,
    },
    attributes: { exclude: ['password'] },
  });

  if (!currentUser) {
    return next(new AppError('The owner of the token no longer exists', 401));
  }

  // Grant access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
