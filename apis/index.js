const express = require('express');
const loginRouter = require('./login');
const kanbanRouter = require('./kanban');

const router = express.Router();

router.use(loginRouter);
router.use(kanbanRouter);

module.exports = router;
