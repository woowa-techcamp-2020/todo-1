const safePromise = require('../../../utils/safePromise');

const UPDATE_NEXT_NOTE = `UPDATE NOTE
SET next_note_id = ?
WHERE id = ?;`;

const UPDATE_PREV_NOTE = `UPDATE NOTE
SET prev_note_id = ?
WHERE id = ?;`;

const UPDATE_LINK = `UPDATE NOTE
SET prev_note_id = ?, next_note_id = ?, column_id = ?
WHERE id = ?;`;

/**
 * 노트의 연결 관계를 update함
 * @param {Object} connection  mysql2 connection 객체
 * @param {Function} query     query를 실행하는 함수
 * @param {Number} columnId    연결을 갱신할 컬럼의 id
 * @param {Number} noteId      연결을 갱신한 노트의 id
 */
module.exports = async function updateNoteLink(
  connection,
  query,
  noteId,
  columnId,
  beforeNoteId,
  afterNoteId,
) {
  if (beforeNoteId) {
    // UPDATE_NEXT_NOTE
    // ?: next_note_id, NOTE.id
    await safePromise(
      query(connection, UPDATE_NEXT_NOTE, [noteId, beforeNoteId]),
    );
  }

  if (afterNoteId) {
    // UPDATE_PREV_NOTE
    // ?: next_note_id, NOTE.id
    await safePromise(
      query(connection, UPDATE_PREV_NOTE, [noteId, afterNoteId]),
    );
  }

  const [rows, error] = await safePromise(
    // UPDATE_LINK
    // ?: prev_note_id, next_note_id, column_id, noteId
    query(connection, UPDATE_LINK, [
      beforeNoteId,
      afterNoteId,
      columnId,
      noteId,
    ]),
  );

  // 에러가 발생했거나, 하나의 note만 update하지 않은경우
  if (error || rows.affectedRows !== 1) {
    throw new Error();
  }
};
