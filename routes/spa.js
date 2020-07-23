const express = require('express');

const router = express.Router();

const spaFile = 'index.html';

router.get('/', (req, res) => {
  res.render(spaFile);
});

router.get('/kanban', (req, res) => {
  res.render(spaFile);
});

router.get('/error', (req, res) => {
  // SPA 에러 핸들링 테스트용
  res.render(spaFile);
});

module.exports = router;
