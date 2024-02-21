const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(port, () => {
  console.log(`Server Running on Port ${port}`); // eslint-disable-line no-console
});
