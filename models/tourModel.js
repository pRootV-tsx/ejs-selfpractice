const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is requireed'],
      unique: true,
      maxlength: [40, 'Max Character limit is 40'],
      minlength: [10, 'Min Character limit is 10'],
      // validate: [validator.isAlpha, 'Name contains Numeric Characters'],
    },
    slug: { type: String },
    duration: { type: Number, required: [true, 'Duration is required'] },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Minimum Rating is 1.0'],
      max: [5, 'Maximum Rating is 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'Price is required'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
      },
      message: 'Discound Price ({VALUE}) is lower than the price',
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Group size is requried'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is requried'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either difficult or medium  or easy ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Summary is requried'],
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
    imageCover: {
      type: String,
      required: [true, 'Image Cover is requried'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// VIRTUALS
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// MIDDLEWARES  - DOCUMENT
// Pre-Document Middleware ==> This == document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Post-document Middleware

// tourSchema.post('save', function (docs, next) {
//   console.log(docs);
//   next();
// });

// Query middleware ==> This == query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Took ${Date.now() - this.start} Milliseecond`);
  // console.log(docs);
  next();
});

// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// How to use :
/* 
const testTour = new Tour({
  name: 'Test Tour 02',
  price: 406,
  rating: 4.7,
});
*/
