const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db.js');

const UserState = sequelize.define('UserState', {
  state_code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    primaryKey: true,
  },
  state_description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'UserState',
  timestamps: false,
});


const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 8,
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  pw: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('student', 'admin', 'guest'),
    allowNull: false,
  },
  state_code: {
    type: DataTypes.STRING(100),
    references: {
      model: UserState,
      key: 'state_code',
    },
  },
  my_school: {
    type: DataTypes.STRING(100),
  },
  email_notification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'User',
  timestamps: false,
});

User.belongsTo(UserState, {
  foreignKey: 'state_code',
  targetKey: 'state_code',
});

module.exports = { UserState, User };
