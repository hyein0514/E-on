require('dotenv').config();
const { sequelize } = require('./database/db');

require('./models/InterestCategory');
require('./models/Interests');
require('./models/VisionCategory');
require('./models/Visions');
require('./models/Users');
require('./models/Challenge');  


(async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('🗄️  테이블 동기화 완료!');
  } catch (err) {
    console.error('❌ 테이블 동기화 실패:', err);
  } finally {
    process.exit(0);
  }
})();