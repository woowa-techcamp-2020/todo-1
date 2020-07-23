const express = require('express');
const dao = require('../dao/dao.js');
const { body, matchedData, validationResult } = require('express-validator');
const safePromise = require('../utils/safePromise');
const MESSAGE = require('./constants/message');
const CONFIG = require('./constants/config');

const router = express.Router();

router.post(
  '/login',
  [body('userId').isInt({ min: 1 }).trim()],
  async (req, res, next) => {
    const result = {
      success: false,
      message: '',
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      result.message = MESSAGE.LOGIN_PARAMETER_ERROR.TEXT;
      result.description = errors.errors;
      res.status(MESSAGE.LOGIN_PARAMETER_ERROR.STATUS_CODE).json(result);
      return;
    }

    const matchedBody = matchedData(req);
    const [user, userError] = await safePromise(
      dao.getUserById(matchedBody.userId),
    );

    if (userError) {
      result.message = MESSAGE.LOGIN_MYSQL_ERROR.TEXT;
      res.status(MESSAGE.LOGIN_MYSQL_ERROR.STATUS_CODE).json(result);
      return;
    }

    if (!user.id) {
      result.message = MESSAGE.LOGIN_CANNOT_FOUND_USER.TEXT;
      res.status(MESSAGE.LOGIN_CANNOT_FOUND_USER.STATUS_CODE).json(result);
      return;
    }

    const [token, tokenError] = await safePromise(dao.createUserToken(user.id));

    if (tokenError) {
      result.message = MESSAGE.LOGIN_MYSQL_ERROR.TEXT;
      res.status(MESSAGE.LOGIN_MYSQL_ERROR.STATUS_CODE).json(result);
      return;
    }

    result.success = true;
    result.message = MESSAGE.LOGIN_SUCCESS.TEXT;
    result.info = {
      id: user.id,
      name: user.name,
    };

    res.cookie(CONFIG.COOKIE_NAME, token, {
      maxAge: CONFIG.COOKIE_MAX_AGE,
    });
    res.status(MESSAGE.LOGIN_SUCCESS.STATUS_CODE).json(result);
  },
);

module.exports = router;
