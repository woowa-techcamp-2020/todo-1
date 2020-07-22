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
    TEXT: '데이터의 부족합니다.',
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
};
