const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.prototype.validPassword = async function (suppliedPassword) {
    const [hashedPassword, salt] = this.password.split('.');
    const buf = await scryptAsync(suppliedPassword, salt, 64);

    return buf.toString('hex') === hashedPassword;
  };

  User.beforeCreate(async (user, options) => {
    const salt = randomBytes(8).toString('hex');
    const buf = await scryptAsync(user.password, salt, 64);

    user.password = `${buf.toString('hex')}.${salt}`;
  });

  return User;
};
