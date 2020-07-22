const safePromise = require('../../utils/safePromise');

const READ_LINK_NOTES = `SELECT id, prev_note_id, next_note_id FROM NOTE
WHERE id = ? OR id = ?`;

const READ_NOTE_LINK = `SELECT prev_note_id, next_note_id FROM NOTE
WHERE id = ?;`;

const UPDATE_NEXT_NOTE = `UPDATE NOTE
SET next_note_id = ?
WHERE id = ?;`;

const UPDATE_PREV_NOTE = `UPDATE NOTE
SET prev_note_id = ?
WHERE id = ?;`;

const UPDATE_LINK = `UPDATE NOTE
SET prev_note_id = ?, next_note_id = ?
WHERE id = ?;`;

/**
 * 입력받은 인자의 유효성 검사
 * @param {*} connection  mysql2 connection 객체
 * @param {*} query       query를 실행하는 함수
 * @param {*} beforeId    연결 구조에서 앞에 위치한 노트
 * @param {*} afterId     연결 구조에서 뒤에 위치한 노트
 */
async function checkCorrectLink(connection, query, beforeId, afterId) {
  if (!beforeId || !afterId) {
    return true;
  }

  // READ LINK NOTES
  // prev_note_id, next_note_id
  const [rows, error] = await safePromise(
    query(connection, READ_LINK_NOTES, [beforeId, afterId]),
  );
  if (error || rows.length !== 2) {
    return false;
  }

  const isValidLink =
    (rows[0].next_note_id === rows[1].id &&
      rows[1].prev_note_id === rows[0].id) ||
    (rows[0].prev_note_id === rows[1].id &&
      rows[1].next_note_id === rows[0].id);

  // 연결 관계가 유효한지 check
  if (isValidLink) {
    return true;
  }
  return false;
}

module.exports = async function moveNote(noteId, beforeNoteId, afterNoteId) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }
  let result = false;

  try {
    await connection.beginTransaction();
    let rows, error;

    const isCorrectLink = await checkCorrectLink(
      connection,
      this.executeQuery,
      beforeNoteId,
      afterNoteId,
    );
    if (!isCorrectLink) {
      throw new Error();
    }

    /**
     * 이전 노트와의 연결 관계를 끊어줌
     */
    // READ NOTE LINK
    // ?: noteId
    [rows, error] = await safePromise(
      this.executeQuery(connection, READ_NOTE_LINK, [noteId]),
    );

    if (error || rows.length !== 1) {
      throw new Error();
    }

    const { prev_note_id, next_note_id } = rows[0];

    if (prev_note_id !== null) {
      // UPDATE_NEXT_NOTE
      // ?: next_note_id, NOTE.id
      error = await safePromise(
        this.executeQuery(connection, UPDATE_NEXT_NOTE, [
          next_note_id,
          prev_note_id,
        ]),
      )[1];
    }

    if (next_note_id !== null) {
      // UPDATE_NEXT_NOTE
      // ?: prev_note_id, NOTE.id
      error = await safePromise(
        this.executeQuery(connection, UPDATE_PREV_NOTE, [
          prev_note_id,
          next_note_id,
        ]),
      )[0];
    }

    /**
     * 새 위치에 연관되어있는 노트들의 연결관계 갱신
     */
    if (!beforeNoteId && !afterNoteId) {
      throw new Error();
    }

    if (beforeNoteId) {
      // UPDATE_NEXT_NOTE
      // ?: next_note_id, NOTE.id
      error = await safePromise(
        this.executeQuery(connection, UPDATE_NEXT_NOTE, [noteId, beforeNoteId]),
      )[1];
    }
    if (afterNoteId) {
      // UPDATE_PREV_NOTE
      // ?: next_note_id, NOTE.id
      error = await safePromise(
        this.executeQuery(connection, UPDATE_PREV_NOTE, [noteId, afterNoteId]),
      )[1];
    }

    [rows, error] = await safePromise(
      // UPDATE_LINK
      // ?: prev_note_id, next_note_id, noteId
      this.executeQuery(connection, UPDATE_LINK, [
        beforeNoteId,
        afterNoteId,
        noteId,
      ]),
    );

    // 에러가 발생했거나, 하나의 note만 update하지 않은경우
    if (error || rows.affectedRows !== 1) {
      throw new Error();
    }

    result = true;
    await connection.commit();
  } catch (error) {
    result = false;
    connection.rollback();
  } finally {
    connection.release();
  }

  return result;
};
