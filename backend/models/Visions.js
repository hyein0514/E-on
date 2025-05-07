const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');
const VisionCategory = require('./VisionCategory');

const Visions = sequelize.define('Visions', {
  interest_id    : { type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
  interest_detail: { type: DataTypes.STRING },
  category_code  : { type: DataTypes.STRING, allowNull:false }
}, { tableName:'Visions', timestamps:false });

Visions.belongsTo(VisionCategory, { foreignKey:'category_code', as:'category' });
module.exports = Visions;
