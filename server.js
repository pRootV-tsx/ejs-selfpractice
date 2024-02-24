const dotenv = require('dotenv');
const mongoose = require('mongoose');

// ERROR HANDLER
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  // ShutDownt the App
  server.close(() => {
    console.log('UNCAUGHT EXPECTION! Shutting Down!...');
    process.exit(1);
  });
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// config the dotenv path

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('Connection Successfull')); //eslint-disable-line no-console

// 3. Creating our first instance and upload to Database

// Start the Server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server Running on Port ${port}`); // eslint-disable-line no-console
});

// manage unhandled Rejects
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // ShutDownt the App
  server.close(() => {
    console.log('Shutting Down!...');
    process.exit(1);
  });
});
