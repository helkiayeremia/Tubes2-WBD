const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const model = {};

model.Recipe_Ingredient = require('./recipeIngredientModel')(
  sequelize,
  DataTypes
);
model.Recipe = require('./recipeModel')(sequelize, DataTypes);
model.Ingredient = require('./ingredientModel')(sequelize, DataTypes);
model.User = require('./userModel')(sequelize, DataTypes);
model.Request = require('./requestModel')(sequelize, DataTypes);

// Set many to many relationship for Ingredient and Recipe
model.Recipe.belongsToMany(model.Ingredient, {
  through: 'Recipe_Ingredient',
  foreignKey: 'recipe_id',
});

model.Ingredient.belongsToMany(model.Recipe, {
  through: 'Recipe_Ingredient',
  foreignKey: 'ingredient_id',
});

//Set one to many relationship for conjuction table and  (Ingredient, Recipe)
model.Recipe.hasMany(model.Recipe_Ingredient);
model.Recipe_Ingredient.belongsTo(model.Recipe);

model.Ingredient.hasMany(model.Recipe_Ingredient);
model.Recipe_Ingredient.belongsTo(model.Ingredient);

// Set one to many relationship for Recipe and Request
model.Recipe.hasMany(model.Request, {
  foreignKey: 'recipe_id',
});
model.Request.belongsTo(model.Recipe, {
  targetKey: 'id',
  foreignKey: 'recipe_id',
});

module.exports = model;
