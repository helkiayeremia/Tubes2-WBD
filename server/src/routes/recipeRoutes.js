const express = require('express');
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');
const requestRouter = require('../routes/requestRoutes');

const router = express.Router();

router.use('/:recipeId/requests', requestRouter);

router.route('/:id').get(recipeController.getRecipe);

router
  .route('/')
  .get(recipeController.getAllRecipe)
  .post(authController.protect, recipeController.createRecipe);

module.exports = router;
