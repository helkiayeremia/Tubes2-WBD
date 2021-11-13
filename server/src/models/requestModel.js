module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });

  // Pass recipe and ingredient model
  Request.prototype.makeRecipe = function (recipe, Ingredient) {};

  return Request;
};
