const schoolscheduleService = require("../services/schoolScheduleService");

exports.searchSchools = async (req, res) => {
    try {
        const query = req.query.query;
        let results;

        // query가 비어있으면 모든 학교 조회
        if (!query) {
            results = await schoolscheduleService.searchSchools();
        } else {
            results = await schoolscheduleService.searchSchools(query);
        }
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
        const { grade } = req.query; // 학년 (default: null)

        // 필수 파라미터 빠질 경우 에러 처리
        if (!schoolId)
            return res
                .status(400)
                .json({ error: "schoolId를 필수로 입력해야 합니다" });

        // 학사일정 데이터 요청
        const schedule = await schoolscheduleService.getSchoolSchedule(
            schoolId,
            { year, grade }
        ); // year을 객체로 넘겨야 함 (prev 또는 null)
        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "학사 일정 조회 실패" });
    }
};

exports.getAllSchedule = async (req, res) => {
    try {
        const { schoolId, atptCode } = req.params;
        const { year, grade } = req.query;

        if (!schoolId || !atptCode) {
            return res.status(400).json({
                error: "schoolId와 atptCode(교육청 코드)는 필수입니다",
            });
        }

        const schedule = await schoolscheduleService.getAllSchoolSchedule(
            schoolId,
            atptCode,
            { year, grade }
        );

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "전국 학사 일정 조회 실패" });
    }
};
