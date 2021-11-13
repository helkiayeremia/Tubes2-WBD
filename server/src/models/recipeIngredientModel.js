module.exports = (sequelize, DataTypes) => {
  const Recipe_Ingredient = sequelize.define('Recipe_Ingredient', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });

  return Recipe_Ingredient;
};
