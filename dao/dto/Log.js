class Log {
  /**
   * 액티비티 로그의 정보를 전달해주는 DTO
   * @param {Bineary Row} data { id, type, method, ?note_id, ?column_from, ?column_to, ?content_before, ?content_after }
   * @param {Number} id 액티비티 로그의 id
   * @param {String} type 노트, 컬럼 여부 ['note', 'column']
   * @param {String} method 작업의 종류 ['create', 'delete', 'move', 'modify']
   * @param {Number} note_id 해당 노트 id
   * @param {Number} column_from 해당 컬럼 id, 혹은 이동 전 컬럼
   * @param {Number} clumn_to 이동한 컬럼 id
   * @param {String} content_before 변경전 내용
   * @param {String} content_after 변경후 내용
   */
  constructor(data) {
    const {
      id,
      type,
      method,
      note_id,
      column_from,
      column_to,
      content_before,
      content_after,
    } = data;

    this.id = id;
    this.type = type;
    this.method = method;
    this.noteId = note_id;
    this.columnFrom = column_from;
    this.columnTo = column_to;
    this.contentBefore = content_before;
    this.contentAfter = content_after;
  }
}

module.exports = Log;
