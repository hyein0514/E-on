const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');
const { User } = require('./User');

// Board 정의
const Board = sequelize.define('Board', {
  board_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  board_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  board_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Board",
  timestamps: false,
});

// Post 정의
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

// ✅ 관계 즉시 등록
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

module.exports = { Board, Post };
