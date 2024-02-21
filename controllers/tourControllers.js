const Tour = require('../models/tourModel');

// Alias Middleware
exports.aliasTopCheapTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  // req.query.fields = 'name, ratingsAverage, price';
  next();
};

// Classes
class APIfeatures {
  // contructor function
  constructor(query, queryString) {
    // Query =  Query to pass mongoose eg> Tour.find(), User.find() etc...
    // QueryString  == Came from EJS  eg> req.query
    this.query = query;
    this.queryString = queryString;
  }

  // Feature 01 --> Filtering
  filter() {
    // Filter some regular keys
    const queryObj = { ...this.queryString };
    const excludedQueries = ['page', 'limit', 'sort', 'field'];
    excludedQueries.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Build the query
    this.query = Tour.find(JSON.parse(queryStr));
  }
}

exports.getAllTours = async (req, res) => {
  try {
    // 0.Seprate neccessary query and special Queries
    const queryObj = { ...req.query };
    const excludedQueries = ['page', 'limit', 'sort', 'field'];
    excludedQueries.forEach((el) => delete queryObj[el]);

    /*  // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // From direct URL to query
    // const tours = await Tour.find(req.query);
    // to remove the special queries */

    let queryStr = JSON.stringify(queryObj);
    // replace gte|gt|lte|lt to $gte|gt|lte|lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // 1.Build the Query
    let query = Tour.find(JSON.parse(queryStr));

    // B Sorting
    // api/v1/tours/sort=price -->ascending order or /sort=-price -->descending order
    if (req.query.sort) {
      const sortby = req.query.sort.split(',').join('');
      query = query.sort(sortby);
    } else {
      query = query.sort('-createdAt'); // by default it will sort the query in Descending order(-) of  createdAt key.
    }

    // Limiting
    if (req.query.fields) {
      // Limit them
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      try {
        const something = ['price', 'name', 'ratingsAverage'];
        const fieldsCalc = something.split(',').join(' ');
        query = query.select(fieldsCalc);
      } catch (err) {
        console.log('New Error ⛔️⛔️⛔️⛔️⛔️:\n:', err);
      }
    }
    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      // check no of record/collection
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // Execute query
    // const tours = await Tour.find(query);
    const tours = await query;

    // 3.Send Response
    res.status(201).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
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
