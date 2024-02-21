const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is requireed'], unique: true },
  duration: { type: Number, required: [true, 'Duration is required'] },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, required: [true, 'Price is required'] },
  priceDiscount: { type: Number },
  maxGroupSize: {
    type: Number,
    required: [true, 'Group size is requried'],
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is requried'],
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
