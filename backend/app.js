// dotenv 패키지 사용해 환경변수 로드
require('dotenv').config();

// cors 패키지 사용해 CORS 설정
const cors = require('cors');

// Express 앱 구성
const express = require('express');
const db = require('./database/db.js'); 
const app = express();
const schoolScheduleRoute = require('./routes/schoolScheduleRoute'); // 학사 일정 API 라우터
const regionRouter = require('./routes/regionRouter');

// 미들웨어
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // 개발용용
  // origin: '도메인 URL', // 운영용
  credentials: true // 클라이언트에서 쿠키를 사용할 수 있도록 설정
}));


// 라우터
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// 학사 일정 API 라우터
app.use('/schoolSchedule', schoolScheduleRoute);

// 지역 API 라우터
app.use('/regions', regionRouter);

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('DB 에러: ' + err.message);
    res.json(results);
  });
});

module.exports = app; // app을 모듈로 내보냄