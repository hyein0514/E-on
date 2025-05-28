const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

const ChallengeDay = sequelize.define('ChallengeDay', {
  challenge_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,   // 복합 PK의 일부
  },
  day_of_week: {
    type: DataTypes.ENUM(
      'Monday','Tuesday','Wednesday',
      'Thursday','Friday','Saturday','Sunday'
    ),
    allowNull: false,
    primaryKey: true,   // 복합 PK: (challenge_id, day_of_week)
  }
}, {
  tableName: 'Challenge_Days',
  timestamps: false     // 생성/수정 시간을 따로 관리하지 않으므로 false
});

module.exports = ChallengeDay;
