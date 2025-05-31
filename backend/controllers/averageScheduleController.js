const {
    getAverageScheduleByRegion,
    generateAllAverageSchedule,
} = require("../services/averageScheduleService");

exports.getAverageScheduleByRegion = async (req, res) => {
    const { region } = req.params;
    const { year, grade } = req.query;

    console.log("getAverageScheduleByRegion 호출됨");
    console.log("  └ region:", region);
    console.log("  └ year:", year);
    console.log("  └ grade:", grade);

    if (!region || region.trim() === "") {
        return res.status(400).json({
            status: "fail",
            message: "region 쿼리 파라미터가 필요합니다.",
        });
    }

    try {
        const scheduleList = await getAverageScheduleByRegion(
            region,
            year,
            grade
        );
        res.status(200).json({
            status: "success",
            data: scheduleList,
        });
    } catch (error) {
        console.error("❌ 평균 학사일정 조회 실패:", error.message);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

exports.generateAllAverageSchedule = async (req, res) => {
    try {
        await generateAllAverageSchedule();
        res.status(201).json({
            status: "success",
            message: "전체 지역 평균 학사일정 생성 완료",
        });
    } catch (error) {
        console.error("❌ 전체 생성 실패:", error.message);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
