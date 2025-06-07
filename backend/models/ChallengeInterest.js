// models/ChallengeInterest.js

const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

const ChallengeInterest = sequelize.define(
  'ChallengeInterest',
  {
    challenge_interest_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    challenge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Challenge',      // 실제 DB에 있는 Challenge 테이블 이름
        key: 'challenge_id'
      },
      onDelete: 'CASCADE'
    },
    interest_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Interests',      // 실제 DB에 있는 Interests 테이블 이름
        key: 'interest_id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    tableName: 'Challenge_Interest',
    timestamps: false
  }
);

module.exports = ChallengeInterest;
