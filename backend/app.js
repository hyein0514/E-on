// Express 앱 구성
const express = require('express');
const db = require('./database/db'); 
const app = express();

// 미들웨어
app.use(express.json());

// 라우터
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('DB 에러: ' + err.message);
    res.json(results);
  });
});

module.exports = app; // app을 모듈로 내보냄