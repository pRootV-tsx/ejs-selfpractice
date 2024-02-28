const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // console.log(users); //Here passwords are hidden because of select: false in schema
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(200).json({
    status: 'Not Ready',
    message: 'This Callback Function not  Coded! yet',
  });
};

exports.updateMe = (req, res, next) => {
  /* 
    1. Create error if user POSTS password data
    2. Update the user document
    
    */

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, PLease use /updatemypasswor',
        400,
      ),
    );

    res.status(201).json({
      status: 'success',
      
    });
  }
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'Not Ready',
    message: 'This Callback Function not  Coded! yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'Not Ready',
    message: 'This Callback Function not  Coded! yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'Not Ready',
    message: 'This Callback Function not  Coded! yet',
  });
};
