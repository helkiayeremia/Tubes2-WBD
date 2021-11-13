const { Ingredient } = require('./model');

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Recipe.prototype.formatRecipe = function () {
    let recipe = this.toJSON();

    recipe = {
      id: recipe.id,
      name: recipe.name,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      ingredients: recipe.Ingredients.map((ingredient) => {
        return {
          id: ingredient.id,
          name: ingredient.name,
          quantity: ingredient.Recipe_Ingredient.quantity,
        };
      }),
    };

    return recipe;
  };

  return Recipe;
};
