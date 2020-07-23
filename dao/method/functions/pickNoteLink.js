const safePromise = require('../../../utils/safePromise');

const READ_NOTE_LINK = `SELECT prev_note_id, next_note_id FROM NOTE
WHERE id = ?;`;

const UPDATE_NEXT_NOTE = `UPDATE NOTE
SET next_note_id = ?
WHERE id = ?;`;

const UPDATE_PREV_NOTE = `UPDATE NOTE
SET prev_note_id = ?
WHERE id = ?;`;

/**
 * 해당 노트와 연결된 노트들의 연결관계를 갱신해줌
 * @param {Object} connection  mysql2 connection 객체
 * @param {Function} query     query를 실행하는 함수
 * @param {Number} noteId      연결을 갱신한 노트의 id
 */
module.exports = async function pickNoteLink(connection, query, noteId) {
  // READ NOTE LINK
  // ?: noteId
  let [rows, error] = await safePromise(
    query(connection, READ_NOTE_LINK, [noteId]),
  );
  if (error || rows.length !== 1) {
    throw new Error();
  }

  const { prev_note_id, next_note_id } = rows[0];

  if (prev_note_id !== null) {
    // UPDATE_NEXT_NOTE
    // ?: next_note_id, NOTE.id
    error = await safePromise(
      query(connection, UPDATE_NEXT_NOTE, [next_note_id, prev_note_id]),
    )[1];
  }

  if (next_note_id !== null) {
    // UPDATE_NEXT_NOTE
    // ?: prev_note_id, NOTE.id
    error = await safePromise(
      query(connection, UPDATE_PREV_NOTE, [prev_note_id, next_note_id]),
    )[0];
  }
};
