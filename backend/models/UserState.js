const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');

const UserState = sequelize.define('UserState', {
  state_code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    primaryKey: true,
  },
  state_description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'UserState',
  timestamps: false,
});

module.exports = UserState;
