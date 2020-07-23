const safePromise = require('../../utils/safePromise');

const Log = require('../dto/Log');
const CONSTANT = require('../constants/log');

const INSERT_LOG = `INSERT INTO ACTIVITY_LOG 
(
  \`method\`,
  \`type\`,
  user_name,
  note_title,
  column_title,
  column_to_title,
  change_title
)
VALUES (?, ?, ?, ?, ?, ?, ?);`;

function trimUpperCase(string) {
  if (typeof string !== 'string') {
    return null;
  }
  let upperCase = string.toUpperCase();
  if (CONSTANT.METHOD[upperCase]) {
    return CONSTANT.METHOD[upperCase];
  }

  if (CONSTANT.TYPE[upperCase]) {
    return CONSTANT.TYPE[upperCase];
  }
  return null;
}

/**
 * 객체들의 type을 명확히 해주는 함수
 * @param {Object} data
 * @returns {Object} data 가공한 데이터
 */
function trimData({
  type,
  method,
  userName,
  noteTitle,
  columnTitle,
  columnToTitle,
  changeTitle,
}) {
  const data = {};

  data.method = trimUpperCase(method);
  data.type = trimUpperCase(type);
  data.userName = userName ? `${userName}` : null;
  data.noteTitle = noteTitle ? `${noteTitle}` : null;
  data.columnTitle = columnTitle ? `${columnTitle}` : null;
  data.columnToTitle = columnToTitle ? `${columnToTitle}` : null;
  data.changeTitle = changeTitle ? `${changeTitle}` : null;

  return data;
}

function checkParams({
  method,
  type,
  userName,
  noteTitle,
  columnTitle,
  columnToTitle,
  changeTitle,
}) {
  switch (type) {
    case CONSTANT.TYPE.COLUMN: {
      if (method === CONSTANT.METHOD.CREATE && (!userName || !columnTitle)) {
        throw new Error('컬럼 생성 인자 부족');
      }
      if (method === CONSTANT.METHOD.DELETE && (!userName || !columnTitle)) {
        throw new Error('컬럼 삭제 인자 부족');
      }
      if (
        method === CONSTANT.METHOD.MODIFY &&
        (!userName || !columnTitle || !changeTitle)
      ) {
        throw new Error('컬럼 수정 인자 부족');
      }
      break;
    }
    case CONSTANT.TYPE.NOTE: {
      if (method === CONSTANT.METHOD.CREATE && (!userName || !noteTitle)) {
        throw new Error('노트 생성 인자 부족');
      }
      if (method === CONSTANT.METHOD.DELETE && (!userName || !noteTitle)) {
        throw new Error('노트 삭제 인자 부족');
      }
      if (
        method === CONSTANT.METHOD.MODIFY &&
        (!userName || !noteTitle || !changeTitle)
      ) {
        throw new Error('노트 변경 인자 부족');
      }
      if (
        method === CONSTANT.METHOD.MOVE &&
        (!userName || !noteTitle || !columnTitle || !columnToTitle)
      ) {
        throw new Error('노트 이동 인자 부족');
      }
      break;
    }
  }
}

/**
 * 로그를 생성하는 method
 * @param {Object} connection  mysql2 connection 객체
 * @param {Function} query     query를 실행하는 함수
 * @param {Object} data { type, method, ?noteId, ?columnId, ?columnTo, ?contentBefore, ?contentAfter }
 */
module.exports = async function createLog(data) {
  data = trimData(data);
  const {
    method,
    type,
    userName,
    noteTitle,
    columnTitle,
    columnToTitle,
    changeTitle,
  } = data;

  if (!method || !type) {
    return false;
  }
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }

  let result = false;
  try {
    await connection.beginTransaction();
    // 각 method, type 별로 prametors가 제대로 있는지 검사

    checkParams(data);

    // INSERT_LOG
    // ?: method, type, user_name, note_title, column_title, column_to_title, change_title
    const [row, rowError] = await safePromise(
      this.executeQuery(connection, INSERT_LOG, [
        method,
        type,
        userName,
        noteTitle,
        columnTitle,
        columnToTitle,
        changeTitle,
      ]),
    );

    if (rowError || row.affectedRows !== 1) {
      throw new Error('로그를 생성하는데 에러가 있습니다.');
    }

    await connection.commit();
    result = new Log(data);
  } catch (error) {
    connection.rollback();
  } finally {
    connection.release();
  }

  return result;
};
