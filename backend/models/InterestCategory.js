const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

module.exports = sequelize.define('InterestCategory', {
  category_code: { type: DataTypes.STRING, primaryKey: true },
  category_name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { tableName: 'InterestCategory', timestamps: false });
