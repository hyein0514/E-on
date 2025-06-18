const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const Visions = require('./Visions'); // ✅ 관계 설정을 위해 추가

const SelectVisions = sequelize.define('SelectVisions', {
  vision_select_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  vision_select_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  vision_id: { type: DataTypes.BIGINT, allowNull: false },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
}, {
  tableName: 'SelectVisions',
  timestamps: false,
});

// ✅ 관계 설정 추가 (한 SelectVisions는 하나의 Vision을 가진다)
SelectVisions.belongsTo(Visions, {
  foreignKey: 'vision_id'
});

module.exports = SelectVisions;
