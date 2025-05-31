const { sequelize, Sequelize } = require('../database/db');
const { DataTypes } = Sequelize;
const ChallengeDay = require('./ChallengeDay');
const Interests = require('./Interests')
const Visions = require('./Visions')
const { User } = require('./User');
 
const Challenge = sequelize.define('Challenge',{
    // 1) 기본키
    challenge_id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    creator_contact: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
    title:{
        type: DataTypes.STRING,
        allowNull : false,
    },
    description: {
        type: DataTypes.TEXT,        
        allowNull: false,
    },
    // 최소·최대 연령
    minimum_age: {
        type: DataTypes.INTEGER,     
        allowNull: false,
        validate: { min: 8 }         // CHECK(age >= 8)
    },
    maximum_age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 }         // CHECK(maximum_age >= 0)
    },
    //  최대 참여자 수
    maximum_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }         // CHECK(maximum_people > 0)
    },
    //  날짜 필드들
    application_deadline: {
        type: DataTypes.DATE,        // DATETIME
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
     // 정기 여부 & 반복 설정
    is_recuming: {
        type: DataTypes.BOOLEAN,     
        allowNull: false,
        defaultValue: false,
    },
    repeat_type: {
        type: DataTypes.STRING,      // VARCHAR — WEEKLY, MONTHLY 등
        allowNull: true,
    },
    // 중도 참여 허용 여부
    intermediate_participation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    // 챌린지 상태
    challenge_state: {
        type: DataTypes.ENUM('ACTIVE','CLOSED','CANCELLED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
    user_id: {                       // 개설자 FK
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },{
        tableName: 'Challenge',
        timestamps:true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    
    Challenge.hasMany(ChallengeDay,{
        foreignKey: 'challenge_id',
        as: 'days',
        onDelete: 'CASCADE' //챌린지 삭제하면 요일도 삭제
    });
    /* Challenge_Interest */
    const ChallengeInterest = sequelize.define('Challenge_Interest', {}, {
        tableName:'Challenge_Interest', timestamps:false
      });
      Challenge.belongsToMany(Interests, {
        through: ChallengeInterest,
        foreignKey:'challenge_id',
        otherKey :'interest_id',
        as:'interests'
      });
      
    /* Challenge_Vision */
      const ChallengeVision = sequelize.define('Challenge_Vision', {}, {
        tableName:'Challenge_Vision', timestamps:false
      });
      Challenge.belongsToMany(Visions, {
        through: ChallengeVision,
        foreignKey:'challenge_id',
        otherKey :'vision_id',
        as:'visions'
      });
      /* User 모델과 연관 */
    
    Challenge.belongsTo(User, { foreignKey:'user_id', as:'creator' });


    module.exports = Challenge;
