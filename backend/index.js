const express = require('express');
const db = require('./db');  
const app = express();
require('dotenv').config();
require('./config/database');
const challengeRoutes = require('./routes/challengeRoutes');

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('DB 에러: ' + err.message);
    res.json(results);
  });
});

app.use('/api', challengeRoutes);

app.listen(4000, () => {
  console.log('✅ 서버 실행 중 (포트 4000)');
});
