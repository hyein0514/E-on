require('dotenv').config();
const { rawConnection: db, sequelize } = require('./database/db.js');
const express = require('express');
const app = express();

//const schoolScheduleRoute = require('./routes/schoolScheduleRoute'); // 학사 일정 API 라우터
const challengeRoutes = require('./routes/challengeRoutes');
const participationRoutes = require('./routes/participationRoutes');
const attendanceRoutes = require('./routes/attendance.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const bookmarkRoutes = require('./routes/bookmarkRoutes.js');
const attachmentRoutes = require('./routes/attachmentRoutes.js');

app.use(express.json());

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
app.use('/api', reviewRoutes);
app.use('/api',bookmarkRoutes );
app.use('/api', attachmentRoutes);


module.exports = app; // app을 모듈로 내보냄