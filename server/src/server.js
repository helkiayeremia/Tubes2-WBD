const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const sequelize = require('./utils/database');

// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const app = require('./app');

const setupDB = async () => {
  // testing connection to database
  sequelize
    .authenticate()
    .then(() =>
      console.log('Database connection has been established successfully')
    );

  await sequelize.sync({ alter: true });
};
setupDB();

// Setting up server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
