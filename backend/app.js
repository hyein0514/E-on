// dotenv 패키지 사용해 환경변수 로드
require('dotenv').config();
// cors 패키지 사용해 CORS 설정
const cors = require('cors');

// Express 앱 구성
const { rawConnection: db, sequelize } = require('./database/db.js');
const express = require('express');
const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',  // 개발용
  // origin: '도메인 URL', // 운영용
  credentials: true // 클라이언트에서 쿠키를 사용할 수 있도록 설정
}));

const schoolScheduleRoute = require('./routes/schoolScheduleRoute'); // 학사 일정 API 라우터
const averageScheduleRoute = require('./routes/averageScheduleRouter'); // 지역별 평균 시간표 API 라우터
const regionRouter = require('./routes/regionRouter');
const boardRoute = require('./routes/boardRoute.js');
const challengeRoutes = require('./routes/challengeRoutes');
const participationRoutes = require('./routes/participationRoutes');
const attendanceRoutes = require('./routes/attendance.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const bookmarkRoutes = require('./routes/bookmarkRoutes.js');
const attachmentRoutes = require('./routes/attachmentRoutes.js');

app.use(express.json());
app.use('/schoolSchedule', schoolScheduleRoute);
app.use('/averageSchedule', averageScheduleRoute);
app.use('/regions', regionRouter);
app.use('/boards', boardRoute);
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('DB 에러: ' + err.message);
    res.json(results);
  });
});
app.use('/api', challengeRoutes);
app.use('/api', participationRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', reviewRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', attachmentRoutes);


module.exports = app; // app을 모듈로 내보냄