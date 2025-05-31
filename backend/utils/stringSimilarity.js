// 문자열 유사도 비교 함수
const stringSimilarity = require('string-similarity');

function groupSimilarEvents(events, threshold = 0.6) {
    const groupsEvent = [];

    for (const event of events) {
        const title = event.EVENT_NM;
        let matchedGroup = null;

        // 기존 그룹과 비교하여 유사한 제목을 가진 그룹 찾기
        for (const group of groupsEvent) {
            const similarity = stringSimilarity.compareTwoStrings(title, group.title);
            if (similarity >= threshold) {
                // 유사한 그룹이 있으면 해당 그룹에 이벤트 추가
                matchedGroup = group;
                break;
            }
        }

        if (matchedGroup) {
            // 유사한 그룹이 있으면 해당 그룹에 이벤트 추가
            matchedGroup.events.push(event);
        } else {
            // 유사한 그룹이 없으면 새로운 그룹 생성
            groupsEvent.push({
                title: title,
                events: [event]
            });
        }
    }

    return groupsEvent;
}

module.exports = {
    groupSimilarEvents
};