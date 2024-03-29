const express = require('express');

const tourController = require('../controllers/tourControllers');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour); //to create new tours

// Alias Routing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopCheapTours, tourController.getAllTours);

// AggregationRoutes
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plans/:year').get(tourController.getMontlyPlans);
router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
