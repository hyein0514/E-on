// 주소에서 서울특별시 자치구를 추출하는 유틸 함수
function extractDistrict(address) {
    // 구까지만 추출
    const districtRegex = /서울특별시 ([가-힣]+구)/; // 한글 글자 1개 이상 + 구
    const match = address.match(districtRegex);

    // 매치된 경우 자치구를 반환, 없으면 null 반환
    return match ? match[0] : null;

    // 출력 결과:
    // [
    //   '서울특별시 강남구', // match[0] = 전체 일치 문자열
    //   '강남구',            // match[1] = 첫 번째 캡처 그룹
    //   index: 0,
    //   input: '서울특별시 강남구 역삼동 123',
    //   groups: undefined
    // ]
}

module.exports = {
    extractDistrict,
};
