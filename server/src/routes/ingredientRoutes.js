const express = require('express');
const ingredientController = require('../controllers/ingredientController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:id')
  .get(ingredientController.getIngredient)
  .patch(ingredientController.updateIngredient)
  .delete(authController.protect, ingredientController.deleteIngredient);

router
  .route('/')
  .get(ingredientController.getAllIngredient)
  .post(ingredientController.createIngredient);

module.exports = router;
