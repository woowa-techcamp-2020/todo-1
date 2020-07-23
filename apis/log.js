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
router.get('/log/:page', async (req, res) => {
  const result = {
    success: false,
    message: '',
  };
  const { page } = req.params;

  const [logs, error] = await safePromise(dao.readLogs(parseInt(page)));

  // console.log(logs);

  if (error) {
    result.message = '로그를 읽는데 문제가 발생했습니다.';
    res.status(MESSAGE.GET_KANBAN_MYSQL_ERROR.STATUS_CODE).json(result);
    return;
  }

  if (logs.length === 0) {
    result.message = '로그가 없습니다.';
    res.status(MESSAGE.GET_KANBAN_ERROR.STATUS_CODE).json(result);
    return;
  }

  result.success = true;
  result.message = '로그를 읽었습니다.';
  result.data = logs;
  res.status(MESSAGE.GET_KANBAN_SUCCESS.STATUS_CODE).json(result);
});

module.exports = router;
