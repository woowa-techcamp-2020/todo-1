const safePromise = require('../../utils/safePromise');

const Log = require('../dto/Log');
const CONSTANT = require('../constants/log');

const INSERT_LOG = `INSERT INTO ACTIVITY_LOG 
(method, \`type\`, note_id, \`column\`, column_to, content_before, content_after)
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

function trimNumber(string) {
  const number = parseInt(string);
  if (isNaN(number)) {
    return null;
  }
  return number;
}

/**
 * 객체들의 type을 명확히 해주는 함수
 * @param {Object} data { type, method, ?noteId, ?columnId, ?columnTo, ?contentBefore, ?contentAfter }
 * @returns {Object} data 가공한 데이터
 */
function trimData({
  type,
  method,
  noteId,
  columnId,
  columnTo,
  contentBefore,
  contentAfter,
}) {
  const data = {};

  data.method = trimUpperCase(method);
  data.type = trimUpperCase(type);
  data.noteId = trimNumber(noteId);
  data.columnId = trimNumber(columnId);
  data.columnTo = trimNumber(columnTo);
  data.contentBefore = contentBefore ? `${contentBefore}` : null;
  data.contentAfter = contentAfter ? `${contentAfter}` : null;

  return data;
}

function checkParams({
  type,
  method,
  noteId,
  columnId,
  columnTo,
  contentBefore,
  contentAfter,
}) {
  switch (type) {
    case CONSTANT.TYPE.COLUMN: {
      if (method === CONSTANT.METHOD.CREATE && (!columnId || !contentAfter)) {
        throw new Error('컬럼 생성 인자 부족');
      }
      if (method === CONSTANT.METHOD.DELETE && !columnId) {
        throw new Error('컬럼 삭제 인자 부족');
      }
      if (
        method === CONSTANT.METHOD.MODIFY &&
        (!columnId || !contentAfter || !contentBefore)
      ) {
        throw new Error('컬럼 삭제 인자 부족');
      }
      break;
    }
    case CONSTANT.TYPE.NOTE: {
      if (method === CONSTANT.METHOD.CREATE && (!noteId || !contentAfter)) {
        throw new Error('노트 생성 인자 부족');
      }
      if (method === CONSTANT.METHOD.DELETE && !noteId) {
        throw new Error('노트 삭제 인자 부족');
      }
      if (
        method === CONSTANT.METHOD.MODIFY &&
        (!noteId || !contentAfter || !contentBefore)
      ) {
        throw new Error('노트 변경 인자 부족');
      }
      if (
        method === CONSTANT.METHOD.MOVE &&
        (!noteId || !columnId || !columnTo)
      ) {
        throw new Error('노트 이동 인자 부족');
      }
      break;
    }
  }
}

/**
 * 로그를 생성하는 method
 * @param {Object} data { type, method, ?noteId, ?columnId, ?columnTo, ?contentBefore, ?contentAfter }
 */
module.exports = async function createLog(data) {
  const {
    type,
    method,
    noteId,
    columnId,
    columnTo,
    contentBefore,
    contentAfter,
  } = trimData(data);

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
    // ?: method, type, note_id, column, column_to, content_before, content_after
    const [row, rowError] = await safePromise(
      this.executeQuery(connection, INSERT_LOG, [
        method,
        type,
        noteId,
        columnId,
        columnTo,
        contentBefore,
        contentAfter,
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
