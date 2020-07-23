const safePromise = require('../../utils/safePromise');

const Log = require('../dto/Log');

const SIZE = 4;

const READ_NOTE_LINK = `SELECT 
id, \`type\`, method, user_name, note_title, column_title, column_to_title, change_title, created_at
FROM ACTIVITY_LOG
ORDER BY created_at DESC
LIMIT ${SIZE} OFFSET ?;`;

/**
 * 해당 노트와 연결된 노트들의 연결관계를 갱신해줌
 * @param {Number} page        보여줄 페이지
 */
module.exports = async function readLogs(page) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }

  // READ NOTE LINK
  // ?: noteId
  let [rows, error] = await safePromise(
    this.executeQuery(connection, READ_NOTE_LINK, [(page - 1) * SIZE]),
  );

  // console.log(rows);

  if (error) {
    return false;
  }
  const data = [];
  Array.from(rows).forEach((row) => {
    data.push(new Log(row));
  });
  return data;
};
