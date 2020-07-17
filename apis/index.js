const express = require('express');
const loginRouter = require('./login');

const router = express.Router();

router.use(loginRouter);

module.exports = router;
