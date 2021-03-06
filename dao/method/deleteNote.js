const safePromise = require('../../utils/safePromise');

const READ_NOTE_LINK = `SELECT prev_note_id, next_note_id FROM NOTE
WHERE id = ?;`;

const DELETE_NOTE = `DELETE FROM NOTE
WHERE id = ?;`;

const UPDATE_NEXT_NOTE = `UPDATE NOTE
SET next_note_id = ?
WHERE id = ?;`;

const UPDATE_PREV_NOTE = `UPDATE NOTE
SET prev_note_id = ?
WHERE id = ?;`;

module.exports = async function deleteNote(noteId) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }
  let result = false;

  try {
    await connection.beginTransaction();
    let rows, error;

    // READ NOTE LINK
    // ?: noteId
    [rows, error] = await safePromise(
      this.executeQuery(connection, READ_NOTE_LINK, [noteId]),
    );

    if (error) {
      throw new Error();
    }
    if (rows.length !== 1) {
      throw new Error();
    }

    const { prev_note_id, next_note_id } = rows[0];

    if (prev_note_id !== null) {
      // UPDATE_NEXT_NOTE
      // ?: next_note_id, NOTE.id
      [rows, error] = await safePromise(
        this.executeQuery(connection, UPDATE_NEXT_NOTE, [
          next_note_id,
          prev_note_id,
        ]),
      );
    }

    if (next_note_id !== null) {
      // UPDATE_NEXT_NOTE
      // ?: prev_note_id, NOTE.id
      [rows, error] = await safePromise(
        this.executeQuery(connection, UPDATE_PREV_NOTE, [
          prev_note_id,
          next_note_id,
        ]),
      );
    }

    // DELETE NOTE
    // ?: noteId
    [rows, error] = await safePromise(
      this.executeQuery(connection, DELETE_NOTE, [noteId]),
    );

    if (error) {
      throw new Error();
    }

    // 하나의 note만 update하지 않은경우
    if (rows.affectedRows !== 1) {
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
