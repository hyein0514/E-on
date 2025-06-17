const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const User = require('./User');
const Challenge     = require('./Challenge');

const ParticipatingChallenge = sequelize.define('ParticipatingChallenge', {
  participating_id: {
    type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true
  },
  participating_state: {
    type: DataTypes.ENUM('신청', '진행 중', '완료', '취소'),
    allowNull: false,
    defaultValue: '신청'
  },
  challenge_id: { // ★ FK 추가
    type: DataTypes.BIGINT,
    allowNull: false
  },
  user_id: { // ★ FK 추가
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'ParticipatingChallenge',
  timestamps: false,
});

ParticipatingChallenge.belongsTo(User,      { foreignKey:'user_id',      as:'participant' });
ParticipatingChallenge.belongsTo(Challenge, { foreignKey:'challenge_id' });

Challenge.hasMany(ParticipatingChallenge,   { foreignKey:'challenge_id', as:'participants' });

module.exports = ParticipatingChallenge;