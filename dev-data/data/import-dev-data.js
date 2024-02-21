const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
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
  .then(() => console.log(' DB connection for Data Upoload  successfull'));

// Read the JSON
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);
// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log('Error:⛔️⛔️⛔️⛔️⛔️\n ', err);
  }
  process.exit();
};

// Delete all Data from Collection
const DeleteAllData = async () => {
  try {
    await Tour.deleteMany({}); // Corrected line
    console.log('Data successfully Deleted');
  } catch (err) {
    console.log('Error:⛔️⛔️⛔️⛔️⛔️\n ', err);
  }
  process.exit();
};

console.log(process.argv[2]);

// Using process.argv we will use the Add and Delete Data functions
if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  DeleteAllData();
}
