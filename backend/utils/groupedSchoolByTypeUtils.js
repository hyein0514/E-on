// 들어온 학교 데이터를 초등학교와 중학교로 그룹화하는 함수
function groupSchoolsByType(schools) {
    const grouped = { elementary: [], middle: [] };
    for (const school of schools) {
        if (school.schoolType.includes('초등')) grouped.elementary.push(school);
        else if (school.schoolType.includes('중학')) grouped.middle.push(school);
    }
    return grouped;
}

module.exports = {
    groupSchoolsByType
};