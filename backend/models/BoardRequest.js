const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');
const { User } = require('./User.js');

const BoardRequest = sequelize.define('BoardRequest', {
  request_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  requested_board_name: {
    type: DataTypes.STRING(255),
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
