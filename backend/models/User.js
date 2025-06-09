// models/user.js
const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserState = require('./UserState');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name:        { type: DataTypes.STRING(50),  allowNull: false },
  age:         { type: DataTypes.INTEGER,     allowNull: false, validate:{min:8} },
  email:       { type: DataTypes.STRING(100), allowNull: false, unique: true, validate:{isEmail:true} },
  pw:          { type: DataTypes.STRING(255), allowNull: false },

  // → 추가된 소셜 로그인 필드
  provider:           { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'local' },
  sns_id:             { type: DataTypes.STRING(100), allowNull: true },
  kakao_nickname:     { type: DataTypes.STRING(50),  allowNull: true },
  kakao_profile_image:{ type: DataTypes.STRING(255), allowNull: true },
  google_nickname:    { type: DataTypes.STRING(50),  allowNull: true },
  google_profile_image:{ type: DataTypes.STRING(255),allowNull: true },
  naver_nickname:     { type: DataTypes.STRING(50),  allowNull: true },
  naver_profile_image:{ type: DataTypes.STRING(255),allowNull: true },

  // → 추가된 약관동의 JSON
  agreements: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },

  // → 추가된 자동로그인 토큰
  refresh_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  type: {
    type: DataTypes.ENUM('student','admin','guest'),
    allowNull: false
  },
  state_code:  { type: DataTypes.STRING(100), allowNull: true },
  my_school:   { type: DataTypes.STRING(100), allowNull: true },

  email_notification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  // → 추가된 프로필 이미지
  profile_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  // soft-delete 관련
  deactivatedAt: { type: DataTypes.DATE, allowNull: true },
  deletedAt:     { type: DataTypes.DATE, allowNull: true }
}, {
  tableName:   'User',
  timestamps:  false,
  underscored: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('pw') && user.pw) {
        user.pw = await bcrypt.hash(user.pw, 12);
      }
    }
  },
});

// 관계
User.belongsTo(UserState, {
  foreignKey: 'state_code',
  targetKey: 'state_code'
});

module.exports = User;
