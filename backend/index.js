//index.js
// 서버 실행
const app = require('./app');
const PORT = process.env.PORT || 4000; // 환경변수 PORT가 없으면 4000 사용

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 (포트 ${PORT})`);
});

const selectRouter = require('./routes/select');
app.use('/api/select', selectRouter);
