// models/regionModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db.js");

const Region = sequelize.define(
    "Region",
    {
        region_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
        },
        region_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: "Region",
        timestamps: false, // createdAt, updatedAt 자동 생성 방지
    }
);

Region.associate = (models) => {
    Region.hasMany(models.AverageAcademicSchedule, {
        foreignKey: "region_id",
    });
};

Region.name = "Region"; // 👈 name 수동으로 설정
module.exports = Region; // 👈 객체 말고 model만 export