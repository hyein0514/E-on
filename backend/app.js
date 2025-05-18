// dotenv 패키지 사용해 환경변수 로드
require('dotenv').config();
require('./config/database');

// Express 앱 구성
const express = require('express');
const db = require('./database/db.js'); 
const app = express();

//const schoolScheduleRoute = require('./routes/schoolScheduleRoute'); // 학사 일정 API 라우터
const challengeRoutes = require('./routes/challengeRoutes');
const participationRoutes = require('./routes/participationRoutes');
const attendanceRoutes = require('./routes/attendance.js');

// 미들웨어
app.use(express.json());

// 라우터
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});
//app.use('/api/schoolSchedule', schoolScheduleRoute); // 학사 일정 API 라우터

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('DB 에러: ' + err.message);
    res.json(results);
  });
});

app.use('/api', challengeRoutes);
app.use('/api',participationRoutes);
app.use('/api', attendanceRoutes);


module.exports = app; // app을 모듈로 내보냄