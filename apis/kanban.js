const express = require('express');
const dao = require('../dao/dao.js');
const safePromise = require('../utils/safePromise');

const MESSAGE = require('./constants/message');

const router = express.Router();

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

module.exports = router;
