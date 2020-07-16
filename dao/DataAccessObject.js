const mysql = require('mysql2');
const User = require('./dto/User');
const TABLE = require('./constants/table');

const safePromise = (promise) => {
  return promise.then((data) => [data]).catch((error) => [null, error]);
};

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

  async isConnectSuccess() {
    const [connection, error] = await safePromise(this.getConnection());

    if (error) {
      return false;
    }

    connection.release();
    return true;
  }

  async getUserById(id) {
    const [connection, error] = await safePromise(this.getConnection());

    if (error) {
      throw error;
    }

    return new Promise((resolve, reject) => {
      const userRowsCallback = (err, rows) => {
        if (err) {
          throw err;
        }

        resolve(
          rows.map((row) => {
            return new User(row);
          }),
        );
      };

      try {
        if (error) {
          throw error;
        }

        connection.execute(
          `SELECT * FROM ${TABLE.USER} WHERE id = ?`,
          [id],
          userRowsCallback,
        );
      } catch (e) {
        reject(new Error(e));
      } finally {
        connection.release();
      }
    });
  }
}

module.exports = DataAccessObject;
