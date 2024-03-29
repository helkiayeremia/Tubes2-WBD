const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const recipeRouter = require('./routes/recipeRoutes');
const ingredientRouter = require('./routes/ingredientRoutes');
const userRouter = require('./routes/userRoutes');
const requestRouter = require('./routes/requestRoutes');
const AppError = require('./utils/appError');

const app = express();

app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//ROUTES
app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/ingredients', ingredientRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/requests', requestRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
