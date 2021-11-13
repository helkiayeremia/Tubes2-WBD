const express = require('express');
const requestController = require('../controllers/requestController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/:id')
  .get(requestController.getRequest)
  .patch(requestController.updateRequest)
  .delete(requestController.deleteRequest);

router
  .route('/')
  .get(requestController.getRequests)
  .post(requestController.setRecipeId, requestController.createRequest);

module.exports = router;
