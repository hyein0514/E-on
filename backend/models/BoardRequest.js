const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');
const User = require('./User');

const BoardRequest = sequelize.define('BoardRequest', {
  request_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  requested_board_name: {
    type: DataTypes.STRING(255),
  },
  requested_board_type: {               // 추가된 필드
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  board_audience: {
      type: DataTypes.ENUM('student', 'parent', 'all'),
      allowNull: false,
  },
  request_reason: {                    // 추가된 필드
    type: DataTypes.TEXT,
    allowNull: true,
  },
  request_date: {
    type: DataTypes.DATE,
  },
  request_status: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'BoardRequest',
  timestamps: false,
});

BoardRequest.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = { BoardRequest };