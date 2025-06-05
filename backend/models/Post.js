const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');
const { User } = require('./User.js');
const { Board } = require('./Board.js')

const Post = sequelize.define('Post', {
  post_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  board_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Post",
  timestamps: false,
});


Post.belongsTo(Board, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Board.hasMany(Post, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE'
});
User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

module.exports = { Post };