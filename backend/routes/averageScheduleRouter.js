const express = require("express");
const router = express.Router();
const averageScheduleController = require("../controllers/averageScheduleController");

// 검색 방법: /averageSchedule/region/:region?year=prev&grade=1 또는 ?grade=2 등 (year은 생략 가능)
router.get(
    "/region/:region/schedule",
    averageScheduleController.getAverageScheduleByRegion
); // 지역별 평균 시간표 조회 API

// 전체 지역 평균 학사일정 생성
router.post("/generate", averageScheduleController.generateAllAverageSchedule);

module.exports = router;
