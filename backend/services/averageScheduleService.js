const {
    createAverageSchedule,
} = require("../utils/createAverageScheduleUtils");
const AverageAcademicSchedule = require("../models/AverageAcademicSchedule");
const Region = require("../models/Region");
const { getRegionId } = require("../utils/getRegionId");

// 1. 지역명으로 평균 학사일정 조회
async function getAverageScheduleByRegion(region_name, year, grade) {
    // 지역명으로 지역 ID를 조회 (예외는 해당 함수에서 처리됨)
    const region_id = await getRegionId(region_name);

    // 현재 연도 기준 계산 (3월 이전이면 작년 연도 사용)
    const today = new Date();
    const currentYear =
        today.getMonth() + 1 >= 3
            ? today.getFullYear()
            : today.getFullYear() - 1;

    const targetYear =
        year === "prev"
            ? (currentYear - 1).toString()
            : year || currentYear.toString();

    const whereClause = {
        region_id,
        year: targetYear,
    };

    const schedules = await AverageAcademicSchedule.findAll({
        where: whereClause,
        order: [["average_date", "ASC"]],
    });

    // grade가 1-6 사이의 숫자인지 확인
    if (grade) {
        const gradeKeyMap = {
            1: "one_grade_event_yn",
            2: "tw_grade_event_yn",
            3: "three_grade_event_yn",
            4: "fr_grade_event_yn",
            5: "fiv_grade_event_yn",
            6: "six_grade_event_yn",
        };
        const gradeField = gradeKeyMap[grade];
        if (gradeField) {
            return schedules.filter((schedule) => schedule[gradeField] === "Y");
        }
    }

    return schedules;
}

// 2. 전체 지역의 평균 학사일정 생성
async function generateAllAverageSchedule() {
    console.log("Region 모델:", Region); // undefined면 import 문제

    // 모든 지역 조회
    const regions = await Region.findAll();

    // DB가 비어있을 때 에러 처리
    if (!regions || regions.length === 0) {
        throw new Error("등록된 지역이 없습니다.");
    }

    // 모든 지역 평균 학사일정 생성
    for (const region of regions) {
        const regionName = region.region_name;
        console.log(`\n=== [${regionName}] 지역 평균 학사일정 생성 시작 ===`);

        try {
            await createAverageSchedule(regionName);
            console.log(`✅ [${regionName}] 생성 완료`);
        } catch (err) {
            console.log(`❌ [${regionName}] 생성 실패:`, err.message);
        }
    }

    console.log("\n🎉 전체 지역 평균 학사일정 생성 완료!");
}

module.exports = {
    getAverageScheduleByRegion,
    generateAllAverageSchedule,
};
