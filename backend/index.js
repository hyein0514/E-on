// index.js
const app = require('./app');
const PORT = process.env.PORT || 4000;

// (선택) Sequelize 자동 싱크가 필요하면 아래 주석을 해제하세요.
// const { sequelize } = require('./config/db');
// sequelize.sync({ alter: true })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ 서버 실행 중 (포트 ${PORT})`);
//     });
//   })
//   .catch(err => console.error('DB 연결/싱크 실패:', err));

// 싱크 없이 그냥 실행하려면:
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 (포트 ${PORT})`);
});
