const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const User = require('./User');
const Challenge     = require('./Challenge');

const ParticipatingChallenge = sequelize.define('ParticipatingChallenge', {
  participating_id: {
    type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true
  },
  participating_state: {
    type: DataTypes.ENUM('신청','취소'),
    allowNull: false,
    defaultValue: '신청'
  }
}, {
  tableName: 'ParticipatingChallenge',
  timestamps: false,
//   createdAt: 'created_at',
//   updatedAt: 'updated_at'
});

ParticipatingChallenge.belongsTo(User,      { foreignKey:'user_id',      as:'participant' });
ParticipatingChallenge.belongsTo(Challenge, { foreignKey:'challenge_id' });

Challenge.hasMany(ParticipatingChallenge,   { foreignKey:'challenge_id', as:'participants' });

module.exports = ParticipatingChallenge;