class Log {
  /**
   * 액티비티 로그의 정보를 전달해주는 DTO
   * @param {Bineary Row} row
   * @param {Number} id 로그의 id
   * @param {String} type 노트, 컬럼 여부 ['NOTE', 'COLUMN']
   * @param {String} method 작업의 종류 ['CREATE', 'DELETE', 'MOVE', 'MODIFY']
   * @param {String} user_name 사용자의 이름
   * @param {String} note_title 해당 노트의 내용
   * @param {String} column_title 해당 컬럼의
   * @param {String} column_to_title 이동한 컬럼 id
   * @param {String} change_title 변경전 내용
   * @param {Date} created_at 생성 시간
   */
  constructor(row) {
    const {
      id,
      type,
      method,
      user_name,
      note_title,
      column_title,
      column_to_title,
      change_title,
      created_at,
    } = row;

    this.id = id;
    this.type = type;
    this.method = method;
    this.userName = user_name;
    this.noteTitle = note_title;
    this.columnTitle = column_title;
    this.columnToTitle = column_to_title;
    this.changeTitle = change_title;
    this.time = created_at;
  }
}

module.exports = Log;
