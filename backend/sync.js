const sequelize = require('./config/database');
require('./models/InterestCategory');
require('./models/Interests');
require('./models/VisionCategory');
require('./models/Visions');
require('./models/Users');
require('./models/Challenge');  

(async () => {
  await sequelize.sync({ alter:false });   // alter:true -> DB 스키마 자동 갱신(개발용)
  console.log('🗄️  테이블 동기화 완료!');
  process.exit(0);
})();
