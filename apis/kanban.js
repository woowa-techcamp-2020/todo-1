const express = require('express');
const dao = require('../dao/dao.js');
const safePromise = require('../utils/safePromise');

const MESSAGE = require('./constants/message');

const router = express.Router();

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
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
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
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
  result.data = data;
  res.status(MESSAGE.PUT_NOTE_SUCCESS.STATUS_CODE).json(result);
});

module.exports = router;
