require('dotenv').config();

module.exports = {
  test: {
    host: process.env.DB_TEST_HOST,
    port: process.env.DB_TEST_PORT,
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_NAME,
    connectionLimit: 30,
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 30,
  },
};
