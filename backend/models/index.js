// 모델 초기화 및 관계 설정 파일
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { sequelize } = require("../database/db.js");

const dbModel = {};

// 모델 불러오기
fs.readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"))
    .forEach((file) => {
        const modelFile = require(path.join(__dirname, file));
        const model = modelFile.model || modelFile;
        const name = modelFile.name || model.name;

        dbModel[name] = model;
    });

// 관계 설정
Object.keys(dbModel).forEach((modelName) => {
    if (dbModel[modelName].associate) {
        dbModel[modelName].associate(dbModel);
    }
});

dbModel.sequelize = sequelize;
dbModel.Sequelize = Sequelize;

module.exports = dbModel;
