const { Recipe, Ingredient, Recipe_Ingredient } = require('../models/model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createRecipe = catchAsync(async (req, res, next) => {
  let { ingredients, name } = req.body;

  // Create recipe entry
  let recipe = await Recipe.create({
    name: name,
  });

  // Create array of ingredients needed
  ingredients = ingredients.map((ingredient) => {
    return {
      recipe_id: recipe.id,
      ingredient_id: ingredient.id,
      quantity: ingredient.quantity,
    };
  });

  await Recipe_Ingredient.bulkCreate(ingredients);

  recipe = await Recipe.findOne({
    where: {
      id: recipe.id,
    },
    include: [
      { model: Ingredient, attributes: ['id', 'name'] },
      {
        model: Recipe_Ingredient,
        attributes: ['quantity'],
      },
    ],
  });

  recipe = recipe.formatRecipe();

  res.status(201).json({
    status: 'success',
    data: {
      recipe: recipe,
    },
  });
});

exports.getAllRecipe = catchAsync(async (req, res, next) => {
  let recipes = await Recipe.findAll({ include: Ingredient });

  recipes = recipes.map((recipe) => {
    return recipe.formatRecipe();
  });

  res.status(200).json({
    status: 'success',
    data: {
      recipes: recipes,
    },
  });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  let recipe = await Recipe.findOne({
    where: {
      id: req.params.id,
    },
    include: [{ model: Ingredient, attributes: ['id', 'name'] }],
  });

  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  recipe = recipe.formatRecipe();

  res.status(200).json({
    status: 'success',
    data: {
      recipe: recipe,
    },
  });
});
