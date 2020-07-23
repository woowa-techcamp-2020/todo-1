const safePromise = require('../../utils/safePromise');

const SQL_RENAME_COLUMN = `UPDATE \`COLUMN\`
SET title = ?
WHERE id = ?;`;

module.exports = async function renameColumn(columnId, title) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }
  let result = false;

  try {
    await connection.beginTransaction();

    // UPDATE COLUMN
    // ?: title, columnId
    const [updateRow, updateRowError] = await safePromise(
      this.executeQuery(connection, SQL_RENAME_COLUMN, [title, columnId]),
    );

    if (updateRowError) {
      throw new Error();
    }

    // 하나의 column만 업데이트하지 않은 경우
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
