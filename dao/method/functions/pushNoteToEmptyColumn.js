const safePromise = require('../../../utils/safePromise');

const READ_NOTE_OF_COLUMN = `
SELECT id FROM NOTE
WHERE column_id = ?`;

const UPDATE_NOTE_COLUMN = `UPDATE NOTE
SET prev_note_id = null, next_note_id = null, column_id = ?
WHERE id = ?;`;

/**
 * 빈 컬럼에 새로운 노트를 추가함
 * @param {Object} connection  mysql2 connection 객체
 * @param {Function} query     query를 실행하는 함수
 * @param {Number} columnId    연결을 갱신할 컬럼의 id
 * @param {Number} noteId      연결을 갱신한 노트의 id
 */
module.exports = async function pushNoteToEmptyColumn(
  connection,
  query,
  columnId,
  noteId,
) {
  // READ_NOTE_OF_COLUMN
  // ?: column_id
  const [rows, error] = await safePromise(
    query(connection, READ_NOTE_OF_COLUMN, [columnId]),
  );

  if (rows.length !== 0 || error) {
    throw new Error();
  }

  // 새로운 column에 노트를 추가
  // UPDATE NOTE COLUMN
  // ?: column_id, noteId
  await safePromise(query(connection, UPDATE_NOTE_COLUMN, [columnId, noteId]));
};
