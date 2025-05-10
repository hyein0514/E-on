const schoolscheduleService = require('../services/schoolscheduleService');

exports.searchSchools = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "학교명을 입력하세요" });

        const results = await schoolscheduleService.searchSchools(query);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "학교 검색 실패" });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { year } = req.query; // year=prev 또는 null 가능

        // 필수 파라미터 빠질 경우 에러 처리
        if (!schoolId) return res.status(400).json({ error: "schoolId를 필수로 입력해야 합니다" });

        // 학사일정 데이터 요청
        const schedule = await schoolscheduleService.getSchoolSchedule(schoolId, year);
        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "학사 일정 조회 실패" });
    }
};