const db = require('../database/db');
const sequelize = db.sequelize;
const { DataTypes } = require('sequelize');
const Challenge     = require('./Challenge');  

const Attachment = sequelize.define('Attachment', {
  attachment_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  attachment_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachment_type: {
    type: DataTypes.ENUM('이미지', '문서', '영상', '기타'),
    allowNull: false
  },
  challenge_id: {
  type: DataTypes.BIGINT,
  allowNull: false
},
}, {
  tableName: 'Attachment',
  timestamps: false
});

/* ── 관계 설정 ───────────────────────────────────────── */
Attachment.belongsTo(Challenge, {
  foreignKey: 'challenge_id'
});

Challenge.hasMany(Attachment, {
  foreignKey: 'challenge_id',
  as: 'attachments',
  onDelete: 'CASCADE'
});

module.exports = Attachment;
