// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//     process.env.DB_NAME || 'eon_db',      
//   process.env.DB_USER || 'eon',         
//   process.env.DB_PASSWORD || 'eon',     
//   {
//     host   : process.env.DB_HOST || 'localhost',
//     port   : process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     logging: console.log               // 개발 중엔 SQL 로그 확인용
//   }
// );

// // 연결 테스트
// (async () => {
//     try {
//       await sequelize.authenticate();
//       console.log('✅ Sequelize MySQL 연결 성공!');
//     } catch (err) {
//       console.error('❌ Sequelize MySQL 연결 실패:', err.message);
//     }
//   })();
  
//   module.exports = sequelize;