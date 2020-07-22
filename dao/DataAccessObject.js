const mysql = require('mysql2/promise');
const crypto = require('crypto');
const CONFIG = require('./constants/config');
const TABLE = require('./constants/table');

const User = require('./dto/User');
const UserToken = require('./dto/UserToken');

const safePromise = require('../utils/safePromise');
const dt = require('../utils/datetime');

const getKanbanData = require('./method/getKanbanData');
const createNote = require('./method/createNote');
const updateNote = require('./method/updateNote');
const deleteNote = require('./method/deleteNote');

class DataAccessObject {
  constructor(option) {
    this.pool = mysql.createPool(option);
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  endPool() {
    this.pool.end();
  }

  async executeQuery(connection, sql, preparedStatement) {
    const execute = await connection.execute(sql, preparedStatement);
    return execute[0];
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
DataAccessObject.prototype.createNote = createNote;
DataAccessObject.prototype.updateNote = updateNote;
DataAccessObject.prototype.deleteNote = deleteNote;

module.exports = DataAccessObject;
