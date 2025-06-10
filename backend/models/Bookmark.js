// models/Bookmark.js
const { sequelize } = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Challenge = require('./Challenge');

const Bookmark = sequelize.define('Bookmark', {
  // 필요하다면 컬럼 스키마를 직접 정의해 주세요.
}, {
  tableName: 'Bookmarks',    // ← 실제 테이블명과 정확히 맞추기 (대문자 B!)
  freezeTableName: true,
  timestamps: false,
});

Bookmark.belongsTo(User,      { foreignKey: 'user_id' });
Bookmark.belongsTo(Challenge, { foreignKey: 'challenge_id' });

User.belongsToMany(Challenge, {
  through: Bookmark,
  foreignKey: 'user_id',
  otherKey:   'challenge_id',
  as: 'bookmarkedChallenges'
});
Challenge.belongsToMany(User, {
  through: Bookmark,
  foreignKey: 'challenge_id',
  otherKey:   'user_id',
  as: 'bookmarkedUsers'
});

module.exports = Bookmark;
