// neis에서 학사 일정을 받아오는 api
const axios = require("axios");
const apiKey = process.env.NEIS_API_KEY; // 환경변수에서 API 키 가져오기
if (!apiKey) {
    throw new Error("API key is not defined in environment variables.");
}

// 1. 서울특별시 내 초등, 중학교 검색
// 사용자가 입력한 키워드(query)를 포함하는 학교 목록만 조회
async function searchSchools(query) {
    const url = "https://open.neis.go.kr/hub/schoolInfo"; // 학교기본정보 조회 API URL

    try {
        const params = {
            KEY: apiKey,
            Type: "json",
            pIndex: 1,
            pSize: 1000, // 가능한 한 많이 가져오기
            // ATPT_OFCDC_SC_CODE: "B10", // 서울특별시교육청
        };

        // query가 들어올 경우 학교 이름으로 필터링
        // query가 비어있으면 모든 학교 조회
        if (query && query.trim() !== "") {
            params.SCHUL_NM = query.trim();
        }

        const response = await axios.get(url, {
            params,
        });

        if (!response.data.schoolInfo) return [];

        return response.data.schoolInfo[1].row
            .filter(
                (school) =>
                    !school.SCHUL_KND_SC_NM.includes("고등") &&
                    !school.SCHUL_KND_SC_NM.includes("각종학교(고)") &&
                    !school.SCHUL_KND_SC_NM.includes("평생학교(고)-3년6학기") &&
                    !school.SCHUL_KND_SC_NM.includes("평생학교(고)-2년6학기")
                    // &&
                    // school.LCTN_SC_NM.includes("서울특별시")
            )
            .map((school) => ({
                schoolCode: school.SD_SCHUL_CODE, // 행정 표준 코드
                name: school.SCHUL_NM, // 학교 이름
                address: school.ORG_RDNMA, // 학교 주소
                schoolType: school.SCHUL_KND_SC_NM, // 학교 종류 (초, 중, 고)
                atptCode: school.ATPT_OFCDC_SC_CODE,  // 시도교육청 코드
            }));
    } catch (error) {
        console.error("학교 검색 API 호출 실패:", err);
        throw new Error("학교 검색 API 호출 실패");
    }
}

// 2. 학교 코드와 학년을 받아서 서울특별시 학사 일정 조회
async function getSchoolSchedule(schoolCode, options = {}) {
    const today = new Date(); // 오늘 날짜
    const currentYear =
        today.getMonth() + 1 >= 3
            ? today.getFullYear()
            : today.getFullYear() - 1; // 올해 3월 이후면 올해, 아니면 작년
    const year =
        options.year === "prev"
            ? (currentYear - 1).toString()
            : currentYear.toString();
    const grade = options.grade || null; // 학년 (default: null)

    const url = "https://open.neis.go.kr/hub/SchoolSchedule"; // NEIS API URL

    const response = await axios.get(url, {
        params: {
            KEY: apiKey,
            Type: "json",
            pIndex: 1,
            pSize: 100,
            ATPT_OFCDC_SC_CODE: "B10", // 교육청 코드 (예: 서울특별시교육청)
            SD_SCHUL_CODE: schoolCode,
            AA_FROM_YMD: `${year}0301`, // 학사 일정 시작일 (예: year년 1월 1일)
            AA_TO_YMD: `${parseInt(year) + 1}0228`, // 학사 일정 종료일 (예: year+1년 2월 28일)
        },
    });

    if (!response.data.SchoolSchedule) {
        return [];
    }

    const scheduleData = response.data.SchoolSchedule[1].row;

    // 학년 필터링 요청 시 필터링해서 제공
    return filterByGrade(scheduleData, grade);
}

function filterByGrade(scheduleData, grade) {
    if (!grade) return scheduleData; // grade 없으면 필터링 안 함

    // 학년별 키 매핑
    const gradeKeyMap = {
        1: "ONE_GRADE_EVENT_YN",
        2: "TW_GRADE_EVENT_YN",
        3: "THREE_GRADE_EVENT_YN",
        4: "FR_GRADE_EVENT_YN",
        5: "FIV_GRADE_EVENT_YN",
        6: "SIX_GRADE_EVENT_YN",
    };

    const key = gradeKeyMap[grade.toString()];
    if (!key) return scheduleData; // 잘못된 학년 입력 시 필터 안 함

    // 해당 키가 "Y"인 항목만 필터링
    return scheduleData.filter((item) => item[key] === "Y"); // *은 미존재!?
}

// 3. 학교 코드와 학년을 받아서 전 지역 학사 일정 조회
async function getAllSchoolSchedule(schoolCode, atptCode, options = {}) {
    const today = new Date(); // 오늘 날짜
    const currentYear =
        today.getMonth() + 1 >= 3
            ? today.getFullYear()
            : today.getFullYear() - 1; // 올해 3월 이후면 올해, 아니면 작년
    const year =
        options.year === "prev"
            ? (currentYear - 1).toString()
            : currentYear.toString();
    const grade = options.grade || null; // 학년 (default: null)

    const url = "https://open.neis.go.kr/hub/SchoolSchedule"; // NEIS API URL

    const response = await axios.get(url, {
        params: {
            KEY: apiKey,
            Type: "json",
            pIndex: 1,
            pSize: 100,
            ATPT_OFCDC_SC_CODE: atptCode, // 교육청 코드 (예: 서울특별시교육청 - B10)
            SD_SCHUL_CODE: schoolCode,
            AA_FROM_YMD: `${year}0301`, // 학사 일정 시작일 (예: year년 1월 1일)
            AA_TO_YMD: `${parseInt(year) + 1}0228`, // 학사 일정 종료일 (예: year+1년 2월 28일)
        },
    });

    if (!response.data.SchoolSchedule) {
        return [];
    }

    const scheduleData = response.data.SchoolSchedule[1].row;

    // 학년 필터링 요청 시 필터링해서 제공
    return filterByGrade(scheduleData, grade);
}

function filterByGrade(scheduleData, grade) {
    if (!grade) return scheduleData; // grade 없으면 필터링 안 함

    // 학년별 키 매핑
    const gradeKeyMap = {
        1: "ONE_GRADE_EVENT_YN",
        2: "TW_GRADE_EVENT_YN",
        3: "THREE_GRADE_EVENT_YN",
        4: "FR_GRADE_EVENT_YN",
        5: "FIV_GRADE_EVENT_YN",
        6: "SIX_GRADE_EVENT_YN",
    };

    const key = gradeKeyMap[grade.toString()];
    if (!key) return scheduleData; // 잘못된 학년 입력 시 필터 안 함

    // 해당 키가 "Y"인 항목만 필터링
    return scheduleData.filter((item) => item[key] === "Y"); // *은 미존재!?
}

module.exports = {
    searchSchools,
    getSchoolSchedule,
    getAllSchoolSchedule,
};
