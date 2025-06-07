const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db.js");
const Region = require("./Region.js");

const AverageAcademicSchedule = sequelize.define(
    "AverageAcademicSchedule",
    {
        averageSchedule_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        school_type: {
            type: DataTypes.ENUM("elementary", "middle"),
            allowNull: false,
        },
        event_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        average_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        one_grade_event_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        tw_grade_event_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        three_grade_event_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        fr_grade_event_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        fiv_grade_event_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        six_grade_event_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
        },
        year: {
            type: DataTypes.STRING(4), // 또는 DataTypes.INTEGER로 설정 가능
            allowNull: false,
        },
        region_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        tableName: "AverageAcademicSchedule",
        timestamps: false, // createdAt, updatedAt 자동 생성 방지
    }
);

AverageAcademicSchedule.associate = (models) => {
    AverageAcademicSchedule.belongsTo(models.Region, {
        foreignKey: "region_id",
    });
};

AverageAcademicSchedule.name = "AverageAcademicSchedule"; // 👈 name 수동으로 설정
module.exports = AverageAcademicSchedule; // 👈 객체 말고 model만 export