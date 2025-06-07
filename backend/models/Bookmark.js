const { sequelize } = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Challenge = require('./Challenge');

const Bookmark = sequelize.define('Bookmark', {}, {
  tableName :'bookmarks',
  timestamps:false,
  freezeTableName: true,
});

Bookmark.belongsTo(User,      { foreignKey:'user_id' });
Bookmark.belongsTo(Challenge, { foreignKey:'challenge_id' });

User.belongsToMany(Challenge, {
  through: Bookmark,
  foreignKey:'user_id',
  otherKey :'challenge_id',
  as:'bookmarkedChallenges'
});
Challenge.belongsToMany(User, {
  through: Bookmark,
  foreignKey:'challenge_id',
  otherKey :'user_id',
  as:'bookmarkedUsers'
});

module.exports = Bookmark;