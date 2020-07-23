const safePromise = require('../../utils/safePromise');
const checkCorrectLink = require('./functions/checkCorrectLink');
const pickNoteLink = require('./functions/pickNoteLink');
const pushNoteToEmptyColumn = require('./functions/pushNoteToEmptyColumn');
const updateNoteLink = require('./functions/updateNoteLink');

module.exports = async function moveNote(
  noteId,
  beforeNoteId,
  afterNoteId,
  columnId,
) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }
  let result = false;

  try {
    await connection.beginTransaction();

    // 1. 이전 노트와 연결된 노트들의 연결 관계를 끊어줌
    await pickNoteLink(connection, this.executeQuery, noteId);

    // 2. 이동할 위치의 연결 관계가 유효한지 확인
    await checkCorrectLink(
      connection,
      this.executeQuery,
      beforeNoteId,
      afterNoteId,
      columnId,
    );

    // 3. 새 위치에 연관되어있는 노트들의 연결관계 갱신
    if (!beforeNoteId && !afterNoteId) {
      // 빈 column에 새로운 노트 추가
      await pushNoteToEmptyColumn(
        connection,
        this.executeQuery,
        columnId,
        noteId,
      );
    } else {
      // 연결 관계 갱신
      await updateNoteLink(
        connection,
        this.executeQuery,
        noteId,
        columnId,
        beforeNoteId,
        afterNoteId,
      );
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
