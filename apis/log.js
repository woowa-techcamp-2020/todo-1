const express = require('express');
const dao = require('../dao/dao.js');
const safePromise = require('../utils/safePromise');

const MESSAGE = require('./constants/message');

const router = express.Router();

/**
 * @api {get} /log/:page 액티비티 로그를 페이지단위로 호출
 * @apiName get kanban
 * @apiGroup Log
 *
 * @apiParam {Number} page 액티비티 로그의 페이지 번호 [params]
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

  if (error) {
    result.message = MESSAGE.READ_LOG_ERROR;
    res.status(MESSAGE.READ_LOG_ERROR.STATUS_CODE).json(result);
    return;
  }

  if (logs.length === 0) {
    result.message = MESSAGE.READ_NO_LOG.MESSAGE;
    res.status(MESSAGE.READ_NO_LOG.STATUS_CODE).json(result);
    return;
  }

  result.success = true;
  result.message = MESSAGE.READ_LOG_SUCCESS;
  result.data = logs;
  res.status(MESSAGE.READ_LOG_SUCCESS.STATUS_CODE).json(result);
});

module.exports = router;
