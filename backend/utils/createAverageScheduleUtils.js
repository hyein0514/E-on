const {
    searchSchools,
    getSchoolSchedule,
} = require("../services/schoolScheduleService");
const { groupSchoolsByType } = require("./groupedSchoolByTypeUtils");
const { groupSimilarEvents } = require("./stringSimilarity");
const extractDistrict = require("./addressUtils").extractDistrict;
const { Region, AverageAcademicSchedule } = require("../models");

// 1. 지역별 학교 조회
async function getSchoolByRegion(region) {
    // 모든 학교 조회
    const allSchools = await searchSchools();

    // allSchools.forEach((school) => {
    //     const district = extractDistrict(school.address);
    //     console.log(`주소: ${school.address}`);
    //     console.log(`추출된 구: ${district}`);
    //     console.log(`비교 대상 region: ${region}`);
    //     console.log("같은가?", district === region);
    // });

    // 지역 필터링 (예: 서울특별시 강남구, 서울특별시 성북구 등)
    const filteredSchools = allSchools.filter(
        (school) => extractDistrict(school.address) === region
    );

    // 학교 타입별로 그룹화
    const groupedSchools = groupSchoolsByType(filteredSchools);

    // console.log(filteredSchools);

    return groupedSchools;
}

// 2. 지역내 모든 학교 학사일정 가져오기
async function getScheduleBySchools(groupedSchools) {
    const all = [];

    // 학교 타입별 그룹화
    for (const [schoolType, schoolList] of Object.entries(groupedSchools)) {
        // 학사일정 가져오기
        for (const school of schoolList) {
            const events = await getSchoolSchedule(school.schoolCode);
            all.push(...events.map((e) => ({ ...e, schoolType })));
        }
    }
    return all;
}

// 3. 유사한 학사일정 그룹화 및 평균내기
async function createAverageSchedule(region) {
    const groupedSchools = await getSchoolByRegion(region);
    // console.log(`[1] ${region} 지역의 학교 분류 결과:`);
    // console.dir(groupedSchools, { depth: null });
    const totalSchoolCount = Object.values(groupedSchools).reduce(
        (sum, schoolList) => sum + schoolList.length,
        0
    );

    console.log(`[1] ${region} 지역의 전체 학교 수:`, totalSchoolCount);

    const allEvents = await getScheduleBySchools(groupedSchools);
    console.log(`[2] ${region} 지역의 전체 학사일정 개수:`, allEvents.length);
    // console.log(`[2-1] 예시 학사일정:`, allEvents[0]);

    // 학사 일정을 초등학교와 중학교로 분류
    const eventByType = {
        elementary: allEvents.filter((e) => e.schoolType === "elementary"),
        middle: allEvents.filter((e) => e.schoolType === "middle"),
    };
    console.log(`[3-1] 초등학교 일정 수:`, eventByType.elementary.length);
    console.log(`[3-2] 중학교 일정 수:`, eventByType.middle.length);

    // region_id 조회
    const regionRecord = await Region.findOne({
        where: { region_name: region },
    });
    if (!regionRecord) {
        throw new Error(`해당 지역(${region})의 ID를 찾을 수 없습니다.`);
    }
    console.log(`[4] 지역 ID 조회 결과:`, regionRecord.region_id);

    // 학사일정 유사도 기반 그룹화
    for (const [type, events] of Object.entries(eventByType)) {
        const grouped = groupSimilarEvents(events);
        console.log(`[5] ${type} 유사 이벤트 그룹 수:`, grouped.length);

        for (const group of grouped) {
            // console.log(
            //     `[5-1] 그룹 이름: ${group.title}, 이벤트 수: ${group.events.length}`
            // );

            // 이벤트 수가 1개면 저장하지 않고 건너뛰기
            if (group.events.length < 2) {
                // console.log(
                //     `[경고] 이벤트 수 1개인 특이 일정, 저장 제외: ${group.title}`
                // );
                continue;
            }

            const dates = group.events
                .map((e) => {
                    const ymd = e.AA_YMD;
                    if (!ymd || ymd.length !== 8) return null;
                    const formatted = `${ymd.slice(0, 4)}-${ymd.slice(
                        4,
                        6
                    )}-${ymd.slice(6, 8)}`;
                    const date = new Date(formatted);
                    return isNaN(date.getTime()) ? null : date;
                })
                .filter(Boolean); // 유효하지 않은 날짜 제거
            if (dates.length === 0) {
                console.warn(
                    `[경고] 유효한 날짜 없음 - 이벤트 그룹명: ${group.title}`
                );
                continue; // 날짜 없으면 이 그룹은 건너뜀
            }

            const avgTimestamp = Math.floor(
                dates.reduce((sum, d) => sum + d.getTime(), 0) / dates.length
            );
            const averageDate = new Date(avgTimestamp);

            const averageSchedule = {
                school_type: type,
                event_name: group.title,
                average_date: averageDate,
                one_grade_event_yn: group.events.some(
                    (e) => e.ONE_GRADE_EVENT_YN === "Y"
                )
                    ? "Y"
                    : "N",
                tw_grade_event_yn: group.events.some(
                    (e) => e.TW_GRADE_EVENT_YN === "Y"
                )
                    ? "Y"
                    : "N",
                three_grade_event_yn: group.events.some(
                    (e) => e.THREE_GRADE_EVENT_YN === "Y"
                )
                    ? "Y"
                    : "N",
                // 중학교는 4학년 이상이 없으므로 해당 필드는 항상 "N"
                fr_grade_event_yn: group.events.some(
                    (e) => e.FR_GRADE_EVENT_YN === "Y"
                )
                    ? "Y"
                    : "N",
                fiv_grade_event_yn: group.events.some(
                    (e) => e.FIV_GRADE_EVENT_YN === "Y"
                )
                    ? "Y"
                    : "N",
                six_grade_event_yn: group.events.some(
                    (e) => e.SIX_GRADE_EVENT_YN === "Y"
                )
                    ? "Y"
                    : "N",
                year: averageDate.getFullYear().toString(),
                region_id: regionRecord.region_id,
            };

            // console.log(`[6] 저장 예정 평균 일정:`, averageSchedule);
            await AverageAcademicSchedule.create(averageSchedule);
        }
    }

    console.log(`[${region}] 평균 학사일정 저장 완료!`);
}

module.exports = {
    getSchoolByRegion,
    getScheduleBySchools,
    createAverageSchedule,
};
