const DataAccessObject = require('./DataAccessObject');
const pool = require('./constants/poolOptions').production;

module.exports = new DataAccessObject(pool);
