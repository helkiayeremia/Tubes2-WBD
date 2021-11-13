const { Sequelize } = require('sequelize');

console.log('nama database', process.env.DATABASE_NAME);

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

module.exports = sequelize;
