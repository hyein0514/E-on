// models/ChallengeVision.js

const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;

const ChallengeVision = sequelize.define(
  'ChallengeVision',
  {
    challenge_vision_id: {
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
    vision_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Visions',        // 실제 DB에 있는 Visions 테이블 이름
        key: 'vision_id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    tableName: 'Challenge_Vision',
    timestamps: false
  }
);

module.exports = ChallengeVision;
