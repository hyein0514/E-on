const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');
const { User } = require('./User.js');
const { Post } = require('./Post.js');

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Comment',
  timestamps: false,
});

Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });
User.hasMany(Comment, {
  foreignKey: 'user_id',
});
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

module.exports = { Comment };
