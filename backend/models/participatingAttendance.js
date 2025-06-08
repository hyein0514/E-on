// models/ParticipatingAttendance.js
const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const ParticipatingChallenge = require('./ParticipatingChallenge');

const ParticipatingAttendance = sequelize.define('ParticipatingAttendance', {
  attendance_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  attendance_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  attendance_state: {
    type: DataTypes.ENUM('출석','결석','지각'),
    allowNull: false
  },
 memo: DataTypes.TEXT,
 participating_id: {
   type: DataTypes.BIGINT,
   allowNull: false
 }
}, {
  tableName : 'ParticipatingAttendance',  
  timestamps: false
});

/* FK 연결 */
ParticipatingAttendance.belongsTo(ParticipatingChallenge, {
  foreignKey:'participating_id',
  as: 'participant'
});
ParticipatingChallenge.hasMany(ParticipatingAttendance, {
  foreignKey:'participating_id',
  as:'attendances'
});

module.exports = ParticipatingAttendance;