const AppError = require('../utils/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate Database Value ${value}, please change the value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Validation. ${errors.join('. ')} `;
  return new AppError(message, 400);
};

const handleJWTtokenError = () => {
  return new AppError('Invalid Token please login again!', 401);
};

const handleJWTtokenExpire = () => {
  return new AppError('Token is expired, please login again!', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};
const sendErrorProd = (err, res) => {
  // Operational Error? Then send the Error to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      stack: err.stack,
    });
  } else {
    // Not Operational then dont leak error to client
    console.error('ERROR: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something really went very bad! from our side!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // make a hardcopy of err
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code == 11000) error = handleDuplicateDB(error);

    if (error.name === 'ValidationError') {
      return (error = handleValidationErrorDB(error));
    }

    if (error.name === 'JsonWebTokenError') error = handleJWTtokenError();
    if (error.name === 'TokenExpiredError') error = handleJWTtokenExpire();
    sendErrorProd(error, res);
  }
};

console.log('Env is', process.env.NODE_ENV);
