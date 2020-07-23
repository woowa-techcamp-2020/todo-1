const express = require('express');
const loginRouter = require('./login');
const kanbanRouter = require('./kanban');
const logRouter = require('./log');

const router = express.Router();

router.use(loginRouter);
router.use(kanbanRouter);
router.use(logRouter);

module.exports = router;
