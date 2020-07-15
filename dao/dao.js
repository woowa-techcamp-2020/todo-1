const DataAccessObject = require('./DataAccessObject');
const pool = require('./poolOptions').production;

module.exports = new DataAccessObject(pool);
