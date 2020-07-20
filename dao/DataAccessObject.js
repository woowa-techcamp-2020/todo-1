const mysql = require('mysql2');
const crypto = require('crypto');
const CONFIG = require('./constants/config');
const TABLE = require('./constants/table');

const User = require('./dto/User');
const UserToken = require('./dto/UserToken');

const safePromise = require('../utils/safePromise');
const dt = require('../utils/datetime');

const getKanbanData = require('./method/getKanbanData');

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

  async createUserToken(userId) {
    const [connection, connectionError] = await safePromise(
      this.getConnection(),
    );
    if (connectionError) {
      throw connectionError;
    }

    const token = crypto
      .createHash('sha256')
      .update(`${dt.getCurrentWithFormat()}/${userId}`)
      .digest('hex');

    const expiredAt = dt.getFormatWithAdd(CONFIG.TOKEN_AGE_SECONDS);

    const [_, insertError] = await safePromise(
      this.executeQuery(
        connection,
        `INSERT INTO ${TABLE.USER_TOKEN} (id, user_id, token, expired_at) VALUES (null, ?, ?, ?)`,
        [userId, token, expiredAt],
      ),
    );

    if (insertError) {
      throw insertError;
    }

    connection.release();
    return token;
  }

  async getTokenInfo(token) {
    const [connection, connectionError] = await safePromise(
      this.getConnection(),
    );
    if (connectionError) {
      throw connectionError;
    }

    const [rows, rowsError] = await safePromise(
      this.executeQuery(
        connection,
        `SELECT * FROM ${TABLE.USER_TOKEN} WHERE token = ?`,
        [token],
      ),
    );

    if (rowsError) {
      throw rowsError;
    }

    connection.release();
    return new UserToken(rows[0]);
  }
}

DataAccessObject.prototype.getKanbanData = getKanbanData;

module.exports = DataAccessObject;
