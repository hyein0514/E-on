// models/User.js
const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

const User = sequelize.define('User', {
  user_id:       { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name:          { type: DataTypes.STRING(50),  allowNull: false },
  age:           { type: DataTypes.INTEGER,     allowNull: false, validate:{ min:8 } },
  email:         { type: DataTypes.STRING(100), allowNull: false, unique: true },
  pw:            { type: DataTypes.STRING(255), allowNull: false },
  type:          { type: DataTypes.ENUM('student','admin','guest'), allowNull:false },
  state_code:    { type: DataTypes.STRING(100) },
  my_school:     { type: DataTypes.STRING(100) },
  email_notification: { type: DataTypes.BOOLEAN, defaultValue:false }
}, {
  tableName : 'User',
  timestamps: false
});

module.exports = User;
