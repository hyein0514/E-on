const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

const SelectVisions = sequelize.define('SelectVisions', {
  vision_select_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  vision_select_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  vision_id: { type: DataTypes.BIGINT, allowNull: false },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
}, {
  tableName: 'SelectVisions',
  timestamps: false,
});

module.exports = SelectVisions;
