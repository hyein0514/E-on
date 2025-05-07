const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'eon',
  password: process.env.DB_PASSWORD || 'eon',
  database: process.env.DB_NAME || 'eon_db',
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err.message);
  } else {
    console.log('✅ MySQL 연결 성공!');
  }
});

module.exports = connection;
