const { sequelize } = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Challenge = require('./Challenge');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true
  },
  rating_stars: {
    type: DataTypes.INTEGER,
    allowNull:false,
    validate:{ min:1, max:5 }
  },
  text: DataTypes.TEXT,
  is_edited: {
    type: DataTypes.BOOLEAN, defaultValue:false
  },
  review_date: {
    type: DataTypes.DATE, defaultValue: DataTypes.NOW
  }
}, {
  tableName:'Review',
  timestamps:false
});


Review.belongsTo(User,      { foreignKey:'user_id',      as:'writer' });
Review.belongsTo(Challenge, { foreignKey:'challenge_id' });
Challenge.hasMany(Review,   { foreignKey:'challenge_id', as:'reviews' });

module.exports = Review;