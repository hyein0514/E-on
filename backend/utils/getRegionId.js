// region 이름을 입력하면 해당 지역의 ID를 반환하는 util 함수
const Region = require("../models/Region");

async function getRegionId(regionName) {
    try {
        // 지역 이름으로 지역 ID 조회
        const region = await Region.findOne({
            where: { region_name: regionName },
            attributes: ['region_id']
        });

        if (!region) {
            throw new Error(`지역 "${regionName}"을(를) 찾을 수 없습니다.`);
        }

        return region.region_id;
    } catch (error) {
        console.error("❌ 지역 ID 조회 실패:", error.message);
        throw error;
    }
}

module.exports = { getRegionId };