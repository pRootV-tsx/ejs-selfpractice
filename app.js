const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.get('/', (req, res) => {
  res.end('Welcome To ExpressJS Introduction Classes');
});

// Middlewares

// 1. To check Env
if (process.env.NODE_ENV === 'development') {
  console.log('Development'); // eslint-disable-line no-console
}
// 2. Check and Convert data to JSON
app.use(express.json());

// 3. Custom Middleware
app.use((req, res, next) => {
  console.log('This is a Custom Middleware'); // eslint-disable-line no-console
  req.requesTime = new Date().toISOString();
  next();
});

// 4. To use Static Files like Public
app.use(express.static(`${__dirname}/public`));

// 5.   ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/tours', userRouter);

module.exports = app;
