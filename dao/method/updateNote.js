const safePromise = require('../../utils/safePromise');

const UPDATE_LAST_NOTE = `UPDATE NOTE
SET content = ?
WHERE id = ?;`;

module.exports = async function updateNote(noteId, content) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }
  let result = false;

  try {
    await connection.beginTransaction();

    // UPDATE NOTE
    // ?: content, noteId
    const [updateRow, updateRowError] = await safePromise(
      this.executeQuery(connection, UPDATE_LAST_NOTE, [content, noteId]),
    );

    if (updateRowError) {
      throw new Error();
    }

    // 하나의 note만 update하지 않은경우
    if (updateRow.affectedRows !== 1) {
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
