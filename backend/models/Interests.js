const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const InterestCategory = require('./InterestCategory');

const Interests = sequelize.define('Interests', {
  interest_id    : { type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
  interest_detail: { type: DataTypes.STRING },
  category_code  : { type: DataTypes.STRING, allowNull:false }
}, { tableName:'Interests', timestamps:false });

Interests.belongsTo(InterestCategory, { foreignKey:'category_code', as:'category' });
module.exports = Interests;