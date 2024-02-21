/**
 * 🚀 API Features Class
 * This class provides methods to handle common features of API requests such as filtering, sorting, limiting, and pagination.
 */
class APIfeatures {
  /**
   * 🛠️ Constructor Function
   * @param {Object} query - Query to pass mongoose e.g., Tour.find(), User.find(), etc.
   * @param {Object} queryString - Query string parameters from the request e.g., req.query
   */
  constructor(query, queryString) {
    this.query = query; // Query to be executed
    this.queryString = queryString; // Query string parameters
  }

  /**
   * 📌 Feature 01 - Filtering
   * This method filters the query based on the provided query string parameters.
   * @returns {Object} - Returns the modified query object for further chaining
   */
  filter() {
    // Filter out regular keys
    const queryObj = { ...this.queryString };
    const excludedQueries = ['page', 'limit', 'sort', 'fields'];
    excludedQueries.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Build the query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * 🎯 Feature 02 - Sorting
   * This method sorts the query based on the provided sorting criteria.
   * @returns {Object} - Returns the modified query object for further chaining
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sorting by createdAt
    }
    return this;
  }

  /**
   * 🔍 Feature 03 - Limiting Fields
   * This method limits the fields to be returned by the query.
   * @returns {Object} - Returns the modified query object for further chaining
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Excluding __v field by default
    }
    return this;
  }

  /**
   * 📚 Feature 04 - Pagination
   * This method implements pagination by skipping and limiting the results.
   * @returns {Object} - Returns the modified query object for further chaining
   */
  paginate() {
    const page = this.queryString.page * 1 || 1; // Current page (default: 1)
    const limit = this.queryString.limit * 1 || 100; // Results per page (default: 100)
    const skip = (page - 1) * limit; // Number of documents to skip

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIfeatures;
