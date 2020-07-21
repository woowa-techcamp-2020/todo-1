const safePromise = require('../../utils/safePromise');

const Note = require('../dto/Note');

const SELECT_LAST_NOTE = `SELECT id from NOTE
WHERE column_id = ? AND prev_note_id is null;`;

const INSERT_NOTE = `INSERT INTO NOTE 
(column_id, user_id, \`content\`, prev_note_id, next_note_id)
VALUES (?, ?, ?, null, ?);
`;

const UPDATE_LAST_NOTE = `UPDATE NOTE
SET prev_note_id = ?
WHERE id = ?;`;

module.exports = async function setNote(columnId, noteData) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }
  let result = false;

  try {
    await connection.beginTransaction();

    // GET LAST NOTE OF THIS COLUMN
    // ?: column_id
    const [firstNoteRow, lastNoteRowError] = await safePromise(
      this.executeQuery(connection, SELECT_LAST_NOTE, [columnId]),
    );

    if (firstNoteRow.length === 0 || lastNoteRowError) {
      throw new Error();
    }

    const firstNoteId = firstNoteRow[0].id;

    // INSERT NOTE
    // ?: column_id, user_id, content, prev_note_id
    const [noteRow, noteRowError] = await safePromise(
      this.executeQuery(connection, INSERT_NOTE, [
        columnId,
        noteData.userId,
        noteData.content,
        firstNoteId,
      ]),
    );

    if (noteRowError) {
      throw new Error();
    }
    const { insertId } = noteRow;

    // UPDATE NOTE
    // ?: next_note_id, id
    const [updateRow, updateRowError] = await safePromise(
      this.executeQuery(connection, UPDATE_LAST_NOTE, [insertId, firstNoteId]),
    );

    if (updateRowError) {
      throw new Error();
    }

    // 하나의 note만 update하지 않은경우
    if (updateRow.affectedRows !== 1) {
      throw new Error();
    }

    result = new Note(
      insertId,
      noteData.content,
      noteData.user,
      noteData.userId,
    );

    await connection.commit();
  } catch (error) {
    connection.rollback();
  } finally {
    connection.release();
  }

  return result;
};
