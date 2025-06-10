const Region = require("../models/Region");
const { Op } = require("sequelize");

// 1. DB 내 모든 지역 정보 조회 API
async function getAllRegions() {
    return await Region.findAll({ order: [["region_id", "ASC"]] });
}

// 2. query string으로 지역 정보 조회 API
async function getRegionByName(region_name) {
    return await Region.findAll({
        where: {
            region_name: {
                [Op.like]: `%${region_name}%`, // 부분 일치 검색 가능
            },
        },
        order: [["region_id", "ASC"]], // 지역 id 기준 오름차순 정렬
    });
};

module.exports = {
    getAllRegions,
    getRegionByName,
};