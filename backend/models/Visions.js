const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const VisionCategory = require('./VisionCategory');

const Visions = sequelize.define('Visions', {
  vision_id    : { type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
  vision_detail: { type: DataTypes.STRING },
  category_code  : { type: DataTypes.STRING, allowNull:false }
}, { tableName:'Visions', timestamps:false });

Visions.belongsTo(VisionCategory, { foreignKey:'category_code', as:'category' });
module.exports = Visions;
