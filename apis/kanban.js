const express = require('express');
const dao = require('../dao/dao.js');
const safePromise = require('../utils/safePromise');

const MESSAGE = require('./constants/message');

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
 * @apiGroup kanban
 *
 * @apiParam {Number} columnId 칸반보드의 id [params]
 * @apiParam {String} user 유저의 닉네임 [body]
 * @apiParam {Number} userId 유저의 id값 [body]
 * @apiParam {String} content 노트의 내용 [body]
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
  const { user, userId, content } = req.body;

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

  result.success = true;
  result.message = MESSAGE.PUT_NOTE_SUCCESS.TEXT;
  result.data = note;
  res.status(MESSAGE.PUT_NOTE_SUCCESS.STATUS_CODE).json(result);
});

module.exports = router;