const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Alias Middleware
exports.aliasTopCheapTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  // req.query.fields = 'name, ratingsAverage, price';
  next();
};

// AGGREGATION --  Matching and Grouping
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }, // Corrected to use '$price' instead of '$ratingsAverage'
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    // We can repeat the aggregation methods
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(201).json({
    status: 'success',
    results: stats.length,
    data: {
      stats,
    },
  });
});

exports.getMontlyPlans = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plans = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(201).json({
    status: 'success',
    results: plans.length,
    data: {
      plans,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Create a Instace of APIfeatures for Tours
  // TODO : sort() instance has a bug
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .paginate();

  const tours = await features.query;
  // SEND Responses
  res.status(201).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // findbyID(req.params.id) is a short hand for findOne({_id: req.params.id})

  // If no Tour Found
  if (!tour) {
    return new AppError(`No Tour Found in the Database!`, 404);
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return new AppError(`No Tour Found in the Database!`, 404);
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return new AppError(`No Tour Found in the Database!`, 404);
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
