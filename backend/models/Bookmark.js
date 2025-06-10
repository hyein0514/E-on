// backend/models/Bookmark.js

// 1) Sequelize 인스턴스와 DataTypes 불러오기
const { sequelize } = require('../database/db.js');
const { DataTypes } = require('sequelize');

// 2) 연관된 모델 불러오기
const User      = require('./User');
const Challenge = require('./Challenge');

// 3) Bookmark 모델 정의
const Bookmark = sequelize.define('Bookmark', {
  // 예를 들어 필요하다면 컬럼을 직접 정의할 수 있습니다:
  // id: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true
  // },
  // created_at: {
  //   type: DataTypes.DATE,
  //   defaultValue: DataTypes.NOW
  // }
}, {
  tableName: 'Bookmarks',    // 실제 테이블명과 정확히 맞추기
  freezeTableName: true,
  timestamps: false,
});

// 4) 관계 설정
Bookmark.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Bookmark.belongsTo(Challenge, {
  foreignKey: {
    name: 'challenge_id',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.belongsToMany(Challenge, {
  through: Bookmark,
  foreignKey: 'user_id',
  otherKey: 'challenge_id',
  as: 'bookmarkedChallenges',
});

Challenge.belongsToMany(User, {
  through: Bookmark,
  foreignKey: 'challenge_id',
  otherKey: 'user_id',
  as: 'bookmarkedUsers',
});

module.exports = Bookmark;
