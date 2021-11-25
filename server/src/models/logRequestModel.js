module.exports = (sequelize, DataTypes) => {
  const LogRequest = sequelize.define(
    'LogRequest',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endpoint: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
      },
    },
    { timestamps: false }
  );

  return LogRequest;
};
