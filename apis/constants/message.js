module.exports = {
  LOGIN_PARAMETER_ERROR: {
    TEXT: '올바르지 않은 전송입니다.',
    STATUS_CODE: 400,
  },
  LOGIN_CANNOT_FOUND_USER: {
    TEXT: '존재하지 않는 유저입니다.',
    STATUS_CODE: 404,
  },
  LOGIN_SUCCESS: {
    TEXT: '성공적으로 로그인되었습니다.',
    STATUS_CODE: 200,
  },
  LOGIN_MYSQL_ERROR: {
    TEXT: '알 수 없는 오류가 발생했습니다.',
    STATUS_CODE: 503,
  },
  GET_USER_SUCCESS: {
    TEXT: '성공적으로 데이터를 가져왔습니다.',
    STATUS_CODE: 200,
  },
  GET_USER_CANNOT_FOUND_TOKEN: {
    TEXT: '토큰 정보를 확인할 수 없습니다.',
    STATUS_CODE: 400,
  },
  GET_USER_ERROR: {
    TEXT: '오류가 발생했습니다.',
    STATUS_CODE: 500,
  },

  GET_KANBAN_SUCCESS: {
    TEXT: '성공적으로 데이터를 가져왔습니다',
    STATUS_CODE: 200,
  },
  GET_KANBAN_ERROR: {
    TEXT: '존재하지 않는 kanban입니다',
    STATUS_CODE: 404,
  },
  GET_KANBAN_MYSQL_ERROR: {
    TEXT: '서버에서 에러가 발생했습니다.',
    STATUS_CODE: 500,
  },
  PUT_NOTE_SUCCESS: {
    TEXT: '노트의 추가가 성공적으로 완료되었습니다.',
    STATUS_CODE: 200,
  },
  PUT_NOTE_ERROR: {
    TEXT: '노트의 추가에 문제가 있습니다',
    STATUS_CODE: 500,
  },
  PUT_NOTE_BODY_ERROR: {
    TEXT: '데이터의 부족합니다.',
    STATUS_CODE: 500,
  },
  UPDATE_NOTE_SUCCESS: {
    TEXT: '노트의 변경이 성공적으로 완료되었습니다.',
    STATUS_CODE: 200,
  },
  UPDATE_NOTE_ERROR: {
    TEXT: '노트의 변경에 문제가 있습니다',
    STATUS_CODE: 500,
  },
  UPDATE_NOTE_BODY_ERROR: {
    TEXT: '데이터가 부족합니다.',
    STATUS_CODE: 500,
  },
  DELETE_NOTE_SUCCESS: {
    TEXT: '노트의 삭제가 성공적으로 이루어졌습니다.',
    STATUS_CODE: 200,
  },
  DELETE_NOTE_ERROR: {
    TEXT: '노트를 삭제하지 못했습니다.',
    STATUS_CODE: 500,
  },
  MOVE_NOTE_SUCCESS: {
    TEXT: '노트의 이동이 성공적으로 이루어졌습니다.',
    STATUS_CODE: 200,
  },
  MOVE_NOTE_BODY_ERROR: {
    TEXT: '데이터가 유효하지 않습니다.',
    STATUS_CODE: 500,
  },
  MOVE_NOTE_ERROR: {
    TEXT: '노트를 이동하지 못했습니다.',
    STATUS_CODE: 500,
  },
  RENAME_COLUMN_SUCCESS: {
    TEXT: '컬럼 이름 수정이 성공적으로 이루어졌습니다.',
    STATUS_CODE: 200,
  },
  RENAME_COLUMN_BODY_ERROR: {
    TEXT: '올바르지 않은 전송입니다.',
    STATUS_CODE: 400,
  },
  RENAME_COLUMN_ERROR: {
    TEXT: '컬럼 이름 수정에 실패했습니다.',
    STATUS_CODE: 500,
  },
  READ_LOG_SUCCESS: {
    TEXT: '로그를 읽어오는데 성공했습니다.',
    STATUS_CODE: 200,
  },
  READ_LOG_ERROR: {
    TEXT: '로그를 읽는데 실패했습니다.',
    STATUS_CODE: 500,
  },
  READ_NO_LOG: {
    TEXT: '로그가 더이상 없습니다.',
    STATUS_CODE: 200,
  },
};
