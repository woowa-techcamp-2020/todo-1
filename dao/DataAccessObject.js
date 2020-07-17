const mysql = require('mysql2');
const TABLE = require('./constants/table');
const User = require('./dto/User');
const safePromise = require('../utils/safePromise');

class DataAccessObject {
  constructor(option) {
    this.pool = mysql.createPool(option);
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(function (err, connection) {
        if (err) {
          return reject(err);
        }
        resolve(connection);
      });
    });
  }

  endPool() {
    this.pool.end();
  }

  executeQuery(connection, sql, preparedStatement) {
    return new Promise((resolve, reject) => {
      connection.execute(sql, preparedStatement, (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      });
    });
  }

  async isConnectSuccess() {
    const [connection, connectionError] = await safePromise(
      this.getConnection(),
    );

    connection.release();
    return !connectionError;
  }

  async getUserById(userId) {
    const [connection, connectionError] = await safePromise(
      this.getConnection(),
    );
    if (connectionError) {
      throw connectionError;
    }

    const [rows, rowsError] = await safePromise(
      this.executeQuery(
        connection,
        `SELECT * FROM ${TABLE.USER} WHERE id = ?`,
        [userId],
      ),
    );

    if (rowsError) {
      throw rowsError;
    }

    connection.release();
    return new User(rows[0]);
  }
}

module.exports = DataAccessObject;
