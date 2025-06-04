// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const { sequelize } = require("../database/db.js");

// const db = {};

// // 1. 모델 불러오기 (class 기반)
// fs.readdirSync(__dirname)
//   .filter(file => file !== "index.js" && file.endsWith(".js"))
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize);
//     db[model.name] = model;
//   });

// // 2. N:M 테이블 define (class 안 써도 됨)
// db.Challenge_Interest = sequelize.define('Challenge_Interest', {}, {
//   tableName: 'Challenge_Interest',
//   timestamps: false
// });
// db.Challenge_Vision = sequelize.define('Challenge_Vision', {}, {
//   tableName: 'Challenge_Vision',
//   timestamps: false
// });

// // 3. associate 패턴 호출 (각 모델에서 static associate 메서드 활용)
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) db[modelName].associate(db);
// });

// // 4. **직접 관계 선언도 추가** (hasMany/belongsTo 등은 여기서 써도 됨)
// // -- Challenge & Attachment
// db.Attachment.belongsTo(db.Challenge, { foreignKey: 'challenge_id' });
// db.Challenge.hasMany(db.Attachment, { foreignKey: 'challenge_id', as: 'attachments', onDelete: 'CASCADE' });

// // -- Bookmark & Challenge & User
// db.Bookmark.belongsTo(db.User, { foreignKey: 'user_id' });
// db.Bookmark.belongsTo(db.Challenge, { foreignKey: 'challenge_id' });

// db.User.belongsToMany(db.Challenge, {
//   through: db.Bookmark,
//   foreignKey: 'user_id',
//   otherKey: 'challenge_id',
//   as: 'bookmarkedChallenges'
// });
// db.Challenge.belongsToMany(db.User, {
//   through: db.Bookmark,
//   foreignKey: 'challenge_id',
//   otherKey: 'user_id',
//   as: 'bookmarkedUsers'
// });

// // -- Challenge & ChallengeDay
// db.Challenge.hasMany(db.ChallengeDay, {
//   foreignKey: 'challenge_id',
//   as: 'days',
//   onDelete: 'CASCADE'
// });

// // -- Challenge & Interests (N:M) [associate에서 연결됨, 여기서 추가 선언 필요 없음]
// // -- Challenge & Visions (N:M) [associate에서 연결됨, 여기서 추가 선언 필요 없음]

// // -- Challenge & User (개설자)
// db.Challenge.belongsTo(db.User, { foreignKey: 'user_id', as: 'creator' });

// // -- ParticipatingChallenge & ParticipatingAttendance
// db.ParticipatingAttendance.belongsTo(db.ParticipatingChallenge, { foreignKey: 'participating_id' });
// db.ParticipatingChallenge.hasMany(db.ParticipatingAttendance, { foreignKey: 'participating_id', as: 'attendances' });

// // -- ParticipatingChallenge & User, Challenge
// db.ParticipatingChallenge.belongsTo(db.User, { foreignKey: 'user_id', as: 'participant' });
// db.ParticipatingChallenge.belongsTo(db.Challenge, { foreignKey: 'challenge_id' });
// db.Challenge.hasMany(db.ParticipatingChallenge, { foreignKey: 'challenge_id', as: 'participants' });

// // -- Review & User, Challenge
// db.Review.belongsTo(db.User, { foreignKey: 'user_id', as: 'writer' });
// db.Review.belongsTo(db.Challenge, { foreignKey: 'challenge_id' });
// db.Challenge.hasMany(db.Review, { foreignKey: 'challenge_id', as: 'reviews' });

// // -- BoardRequest <-> User
// db.BoardRequest.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// // db.User.hasMany(db.BoardRequest, { foreignKey: 'user_id' }); // 필요하면 활성화

// // -- Post <-> User
// db.Post.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// db.User.hasMany(db.Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// // -- Post <-> Board
// db.Post.belongsTo(db.Board, { foreignKey: 'board_id', onDelete: 'CASCADE' });
// db.Board.hasMany(db.Post, { foreignKey: 'board_id', onDelete: 'CASCADE' });

// // -- Comment <-> User
// db.Comment.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// db.User.hasMany(db.Comment, { foreignKey: 'user_id' });

// // -- Comment <-> Post
// db.Comment.belongsTo(db.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });
// db.Post.hasMany(db.Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
// 모델 초기화 및 관계 설정 파일
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { sequelize } = require("../database/db.js");

const dbModel = {};

// 모델 불러오기
fs.readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"))
    .forEach((file) => {
        const modelFile = require(path.join(__dirname, file));
        const model = modelFile.model || modelFile;
        const name = modelFile.name || model.name;

        dbModel[name] = model;
    });

// 관계 설정
Object.keys(dbModel).forEach((modelName) => {
    if (dbModel[modelName].associate) {
        dbModel[modelName].associate(dbModel);
    }
});

dbModel.sequelize = sequelize;
dbModel.Sequelize = Sequelize;

module.exports = dbModel;
