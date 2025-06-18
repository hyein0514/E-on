const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');

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
  board_audience: {
      type: DataTypes.ENUM('student', 'parent', 'all'),
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

module.exports = { Board };