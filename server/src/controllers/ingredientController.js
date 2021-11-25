const { Ingredient } = require('../models/model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createIngredient = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const ingredient = await Ingredient.create({
    name: req.body.name,
    stock: req.body.stock,
  });

  res.status(201).json({
    status: 'success',
    data: {
      ingredient: ingredient,
    },
  });
});

exports.getAllIngredient = catchAsync(async (req, res, next) => {
  const ingredients = await Ingredient.findAll();

  res.status(200).json({
    status: 'success',
    data: {
      ingredients: ingredients,
    },
  });
});

exports.getIngredient = catchAsync(async (req, res, next) => {
  const ingredient = await Ingredient.findByPk(req.params.id);

  if (!ingredient) {
    return next(new AppError('No ingredient found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ingredient: ingredient,
    },
  });
});

exports.updateIngredient = catchAsync(async (req, res, next) => {
  let ingredient = await Ingredient.update(req.body, {
    where: { id: req.params.id },
  });

  ingredient = await Ingredient.findByPk(req.params.id);

  res.status(200).json({
    status: 'success',
    data: ingredient,
  });
});

exports.deleteIngredient = catchAsync(async (req, res, next) => {
  const ingredient = await Ingredient.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
