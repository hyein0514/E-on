const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

const SelectInterests = sequelize.define('SelectInterests', {
  select_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  select_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  interest_id: { type: DataTypes.BIGINT, allowNull: false },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
}, {
  tableName: 'SelectInterests',
  timestamps: false,
});

module.exports = SelectInterests;
