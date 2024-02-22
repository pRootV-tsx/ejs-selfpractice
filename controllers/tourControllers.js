const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');
// Alias Middleware
exports.aliasTopCheapTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  // req.query.fields = 'name, ratingsAverage, price';
  next();
};

// AGGREGATION --  Matching and Grouping
exports.getTourStats = async (req, res) => {
  try {
    // 1. Matching
    // ...

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

    // console.log(stats); // Log the intermediate result

    res.status(201).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',

      err: err,
    });
  }
};

exports.getMontlyPlans = async (req, res) => {
  try {
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

    // response
    res.status(201).json({
      status: 'success',
      results: plans.length,
      data: {
        plans,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',

      err: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // Create a Instace of APIfeatures for Tours
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
  } catch (err) {
    // Catch
    res.status(404).json({
      status: 'fail',
      message: err.messsage,
    });
  }
};

// get a particular tour id data based on id
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // findbyID(req.params.id) is a short hand for findOne({_id: req.params.id})
    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.messsage,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // findbyID(req.params.id) is a short hand for findOne({_id: req.params.id})
    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
