const safePromise = require('../../../utils/safePromise');

const READ_LINK_NOTES = `SELECT id, prev_note_id, next_note_id, column_id FROM NOTE
WHERE id = ? OR id = ?`;

function checkLink(firstNote, secondNote) {
  return (
    firstNote.next_note_id === secondNote.id &&
    secondNote.prev_note_id === firstNote.id
  );
}

/**
 * 입력받은 인자의 유효성 검사
 * @param {Object} connection  mysql2 connection 객체
 * @param {Function} query     query를 실행하는 함수
 * @param {Number} beforeId    연결 구조에서 앞에 위치한 노트
 * @param {Number} afterId     연결 구조에서 뒤에 위치한 노트
 * @param {Number} columnId    검사 하고자 하는 column의 id
 */
module.exports = async function checkCorrectLink(
  connection,
  query,
  beforeId,
  afterId,
  columnId,
) {
  if (!beforeId || !afterId) {
    return true;
  }
  // READ LINK NOTES
  // prev_note_id, next_note_id
  const [rows, error] = await safePromise(
    query(connection, READ_LINK_NOTES, [beforeId, afterId]),
  );

  if (error || rows.length === 0 || rows.length > 2) {
    throw new Error();
  }

  const firstNote = {
    id: rows[0].id,
    next_note_id: rows[0].next_note_id,
    prev_note_id: rows[0].prev_note_id,
    column_id: rows[0].column_id,
  };

  if (firstNote.column_id !== columnId) {
    throw new Error();
  }

  const secondNote = {
    id: rows[1].id,
    next_note_id: rows[1].next_note_id,
    prev_note_id: rows[1].prev_note_id,
    column_id: rows[1].column_id,
  };

  // 연결 관계가 유효한지 check
  const isValid =
    (checkLink(firstNote, secondNote) || checkLink(secondNote, firstNote)) &&
    firstNote.column_id === columnId &&
    secondNote.column_id === columnId;

  if (!isValid) {
    throw new Error();
  }
};
