const express = require('express');
const dao = require('../dao/dao.js');
const safePromise = require('../utils/safePromise');

const MESSAGE = require('./constants/message');
const CONSTANT_LOG = require('../dao/constants/log');
const RULE = require('./constants/rule.js');

const router = express.Router();

/**
 * @api {get} /get/:kanbanId Kanban 데이터 요청
 * @apiName get kanban
 * @apiGroup Kanban
 *
 * @apiParam {Number} kanbanId kanban 보드의 id [params]
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 결과 메시지
 */
router.get('/get/:kanbanId', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };
  const { kanbanId } = req.params;

  const [data, error] = await safePromise(
    dao.getKanbanData(parseInt(kanbanId)),
  );
  if (error) {
    result.message = MESSAGE.GET_KANBAN_MYSQL_ERROR.TEXT;
    res.status(MESSAGE.GET_KANBAN_MYSQL_ERROR.STATUS_CODE).json(result);
    return;
  }

  if (data === undefined) {
    result.message = MESSAGE.GET_KANBAN_ERROR.TEXT;
    res.status(MESSAGE.GET_KANBAN_ERROR.STATUS_CODE).json(result);
    return;
  }

  result.success = true;
  result.message = MESSAGE.GET_KANBAN_SUCCESS.TEXT;
  result.data = data;
  res.status(MESSAGE.GET_KANBAN_SUCCESS.STATUS_CODE).json(result);
});

/**
 * @api {put} /column/:columnId Column에 노트 정보를 추가함
 * @apiName create new note
 * @apiGroup Kanban
 *
 * @apiParam {Number} columnId 칸반보드의 id [params]
 * @apiParam {String} user 유저의 닉네임 [body]
 * @apiParam {Number} userId 유저의 id값 [body]
 * @apiParam {String} content 노트의 내용 [body]
 * @apiParam {String} columnTitle 컬럼의 제목 [body]
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 결과 메시지
 */
router.put('/column/:columnId', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };
  const { columnId } = req.params;
  const { user, userId, content, columnTitle } = req.body;

  if (!user || !userId || !content) {
    result.message = MESSAGE.PUT_NOTE_ERROR.TEXT;
    res.status(MESSAGE.PUT_NOTE_ERROR.STATUS_CODE).json(result);
    return;
  }

  const data = {
    user,
    userId,
    content,
  };

  const [note, error] = await safePromise(
    dao.createNote(parseInt(columnId), data),
  );
  if (error) {
    result.message = MESSAGE.PUT_NOTE_BODY_ERROR.TEXT;
    res.status(MESSAGE.PUT_NOTE_BODY_ERROR.STATUS_CODE).json(result);
    return;
  }

  const logData = {
    method: CONSTANT_LOG.METHOD.CREATE,
    type: CONSTANT_LOG.TYPE.NOTE,
    userName: user,
    noteTitle: content,
    columnTitle: columnTitle,
  };
  await safePromise(dao.createLog(logData));

  result.success = true;
  result.message = MESSAGE.PUT_NOTE_SUCCESS.TEXT;
  result.data = note;
  res.status(MESSAGE.PUT_NOTE_SUCCESS.STATUS_CODE).json(result);
});

/**
 * @api {put} /note/:noteId 해당 노트의 정보를 변경함
 * @apiName update note content
 * @apiGroup Kanban
 *
 * @apiParam {Number} noteId 노트의 id [params]
 * @apiParam {String} content 수정할 노트의 내용 [body]
 * @apiParam {String} contentBefore 수정 전 노트의 내용 [body]
 * @apiParam {String} userName 유저의 이름 [body]
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 결과 메시지
 */
router.put('/note/:noteId', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };
  const { noteId } = req.params;
  const { content, contentBefore, userName } = req.body;

  if (!content) {
    result.message = MESSAGE.PUT_NOTE_ERROR.TEXT;
    res.status(MESSAGE.PUT_NOTE_ERROR.STATUS_CODE).json(result);
    return;
  }

  const [ret, error] = await safePromise(
    dao.updateNote(parseInt(noteId), content),
  );
  if (error) {
    result.message = MESSAGE.UPDATE_NOTE_BODY_ERROR.TEXT;
    res.status(MESSAGE.UPDATE_NOTE_BODY_ERROR.STATUS_CODE).json(result);
    return;
  }
  if (!ret) {
    result.message = MESSAGE.UPDATE_NOTE_ERROR.TEXT;
    res.status(MESSAGE.UPDATE_NOTE_ERROR.STATUS_CODE).json(result);
    return;
  }

  const logData = {
    method: CONSTANT_LOG.METHOD.MODIFY,
    type: CONSTANT_LOG.TYPE.NOTE,
    userName: userName,
    noteTitle: contentBefore,
    changeTitle: content,
  };
  await safePromise(dao.createLog(logData));

  result.success = true;
  result.message = MESSAGE.UPDATE_NOTE_SUCCESS.TEXT;
  res.status(MESSAGE.UPDATE_NOTE_SUCCESS.STATUS_CODE).json(result);
});

/**
 * @api {delete} /note/:noteId 해당 노트를 삭제함
 * @apiName delete note
 * @apiGroup Kanban
 *
 * @apiParam {Number} noteId 노트의 id [params]
 * @apiParam {String} userName 사용자 이름 [body]
 * @apiParam {String} noteTitle 이동한 노트의 title [body]
 * @apiParam {String} columnTitle 노트의 처음 column의 title [body]
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 결과 메시지
 */
router.delete('/note/:noteId', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };
  const { noteId } = req.params;
  const { userName, noteTitle, columnTitle } = req.body;

  const [ret, error] = await safePromise(dao.deleteNote(parseInt(noteId)));

  if (error || !ret) {
    result.message = MESSAGE.DELETE_NOTE_ERROR.TEXT;
    res.status(MESSAGE.DELETE_NOTE_ERROR.STATUS_CODE).json(result);
    return;
  }

  const logData = {
    method: CONSTANT_LOG.METHOD.DELETE,
    type: CONSTANT_LOG.TYPE.NOTE,
    userName: userName,
    noteTitle: noteTitle,
    columnTitle: columnTitle,
  };
  await safePromise(dao.createLog(logData));

  result.success = true;
  result.message = MESSAGE.DELETE_NOTE_SUCCESS.TEXT;
  res.status(MESSAGE.DELETE_NOTE_SUCCESS.STATUS_CODE).json(result);
});

/**
 * @api {patch} /note/move/:noteId 해당 노트 이동시킴
 * @apiName move note
 * @apiGroup Kanban
 *
 * @apiParam {Number} noteId 노트의 id [params]
 * @apiParam {Number} beforeNoteId 노트의 id [body]
 * @apiParam {Number} afterNoteId 노트의 id [body]
 * @apiParam {Number} columnId 이동하고자 하는 column [body]
 * @apiParam {String} userName 사용자 이름 [body]
 * @apiParam {String} noteTitle 이동한 노트의 title [body]
 * @apiParam {String} columnTitle 노트의 처음 column의 title [body]
 * @apiParam {String} columnToTitle 이동한 노트의 title [body]
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 결과 메시지
 */
router.patch('/note/move/:noteId', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };

  const { noteId } = req.params;
  let {
    beforeNoteId,
    afterNoteId,
    columnId,
    userName,
    noteTitle,
    columnTitle,
    columnToTitle,
  } = req.body;

  beforeNoteId = isNaN(parseInt(beforeNoteId)) ? null : parseInt(beforeNoteId);
  afterNoteId = isNaN(parseInt(afterNoteId)) ? null : parseInt(afterNoteId);
  columnId = isNaN(parseInt(columnId)) ? null : parseInt(columnId);

  if (!columnId) {
    result.message = MESSAGE.MOVE_NOTE_BODY_ERROR.TEXT;
    res.status(MESSAGE.MOVE_NOTE_BODY_ERROR.STATUS_CODE).json(result);
    return;
  }

  const [ret, error] = await safePromise(
    dao.moveNote(parseInt(noteId), beforeNoteId, afterNoteId, columnId),
  );

  if (error || !ret) {
    result.message = MESSAGE.MOVE_NOTE_ERROR.TEXT;
    res.status(MESSAGE.MOVE_NOTE_ERROR.STATUS_CODE).json(result);
    return;
  }

  const logData = {
    method: CONSTANT_LOG.METHOD.MOVE,
    type: CONSTANT_LOG.TYPE.NOTE,
    userName: userName,
    noteTitle: noteTitle,
    columnTitle: columnTitle,
    columnToTitle: columnToTitle,
  };
  await safePromise(dao.createLog(logData));

  result.success = true;
  result.message = MESSAGE.MOVE_NOTE_SUCCESS.TEXT;
  res.status(MESSAGE.MOVE_NOTE_SUCCESS.STATUS_CODE).json(result);
});

/**
 * @api {patch} /column/rename/:columnId 해당 컬럼 타이틀 변경
 * @apiName rename column
 * @apiGroup Kanban
 *
 * @apiParam {Number} columnId 컬럼의 id [params]
 * @apiParam {Number} title 변경될 타이틀 내용 [body]
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 결과 메시지
 */
router.patch('/column/rename/:columnId', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };

  const { columnId } = req.params;
  let { title } = req.body;

  if (
    !title ||
    title.length > RULE.COLUMN_TITLE.maxLength ||
    title.length < RULE.COLUMN_TITLE.minLength
  ) {
    result.message = MESSAGE.RENAME_COLUMN_BODY_ERROR.TEXT;
    res.status(MESSAGE.RENAME_COLUMN_BODY_ERROR.STATUS_CODE).json(result);
    return;
  }

  const [ret, error] = await safePromise(
    dao.renameColumn(parseInt(columnId), title),
  );

  if (error || !ret) {
    result.message = MESSAGE.RENAME_COLUMN_ERROR.TEXT;
    res.status(MESSAGE.RENAME_COLUMN_ERROR.STATUS_CODE).json(result);
    return;
  }

  result.success = true;
  result.message = MESSAGE.RENAME_COLUMN_SUCCESS.TEXT;
  res.status(MESSAGE.RENAME_COLUMN_SUCCESS.STATUS_CODE).json(result);
});

module.exports = router;
