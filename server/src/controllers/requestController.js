const {
  Request,
  Recipe,
  Ingredient,
  Recipe_Ingredient,
  User,
} = require('../models/model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const getRequestRecipe = async (request, Recipe) => {
  const recipe_id = request.getDataValue('recipe_id');
  let recipe = await Recipe.findOne({
    where: {
      id: recipe_id,
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

  return recipe;
};

const checkStock = async (request, recipe, Ingredient) => {
  let newStock = [];
  for (const ingredient of recipe.ingredients) {
    const ingredientInstance = await Ingredient.findByPk(ingredient.id);
    const stock = ingredientInstance.getDataValue('stock');

    if (stock < ingredient.quantity * request.getDataValue('amount')) {
      return false;
    }

    // Save decreased stock value if check stock success
    newStock.push(stock - ingredient.quantity * request.getDataValue('amount'));
  }
  return newStock;
};

const updateStock = async (recipe, Ingredient, newStock) => {
  // for (const ingredient of recipe.ingredients)
  for (let i = 0; i < recipe.ingredients.length; i++) {
    await Ingredient.update(
      { stock: newStock[i] },
      {
        where: { id: recipe.ingredients[i].id },
      }
    );
  }
};

exports.setRecipeId = (req, res, next) => {
  if (!req.body.recipeId) req.body.recipeId = req.params.recipeId;
  next();
};

exports.createRequest = catchAsync(async (req, res, next) => {
  const request = await Request.create({
    recipe_id: req.body.recipeId,
    amount: req.body.amount,
  });

  let users = await User.findAll({ raw: true });
  for (const user of users) {
    await new Email(user, '#').sendRequest();
  }

  res.status(201).json({
    status: 'success',
    data: {
      request: request,
    },
  });
});

exports.getRequests = catchAsync(async (req, res, next) => {
  const requests = await Request.findAll();

  res.status(200).json({
    status: 'success',
    data: {
      requests: requests,
    },
  });
});

exports.getRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findByPk(req.params.id);

  if (!request) {
    return next(new AppError('No request found with that ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      request: request,
    },
  });
});

exports.updateRequest = catchAsync(async (req, res, next) => {
  if (req.body.status === false) {
    await Request.update(req.body, { where: { id: req.params.id } });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }

  const request = await Request.findByPk(req.params.id);
  const recipe = await getRequestRecipe(request, Recipe);
  const newStock = await checkStock(request, recipe, Ingredient);

  if (!newStock) {
    return next(new AppError('Ingredient stock not enough!', 500));
  }

  await updateStock(recipe, Ingredient, newStock);

  await Request.update(req.body, { where: { id: req.params.id } });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteRequest = catchAsync(async (req, res, next) => {
  const request = await Request.destroy({
    where: { id: req.params.id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
