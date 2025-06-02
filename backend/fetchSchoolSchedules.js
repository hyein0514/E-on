const axios = require('axios');
require('dotenv').config();

// 🏫 대표 학교 코드 리스트
const schoolCodes = [
  "7132131", // 예: 남서울중학교
  "7130451",
  "7131004"
];

// 🗂 월별 이벤트 누적용 (정규화된 이름 기준)
const monthlyEvents = {}; // 예: { "3": ["입학식", "방학", ...] }

// 🎯 유사 행사명을 통일시키는 함수
function normalizeEventName(name) {
  if (!name) return '';

  const cleaned = name.replace(/\s+/g, '').toLowerCase(); // 공백 제거 후 소문자

  if (cleaned.includes('입학')) return '입학식';
  if (cleaned.includes('졸업')) return '졸업식';
  if (cleaned.includes('방학')) return '방학';
  if (cleaned.includes('개학')) return '개학식';
  if (cleaned.includes('시험')) return '시험';
  if (cleaned.includes('운동회')) return '운동회';
  if (cleaned.includes('소풍') || cleaned.includes('현장체험')) return '소풍/체험학습';

  // 기본적으로 원본 반환 (미처리된 행사명)
  return name.trim();
}

// 📅 날짜에서 월 정보 추출
function getMonthFromDate(dateStr) {
  return parseInt(dateStr.substring(4, 6), 10);
}

// 🧠 학교 코드별 일정 호출
async function fetchSchoolSchedule(code) {
  try {
    const res = await axios.get(`http://localhost:4000/api/schoolScheduleRoute/schools/${code}/schedule`);
    const data = res.data;

    console.log(`🔍 ${code} 응답 데이터 예시:`, data.slice(0, 3)); // 추가

    for (const event of data) {
      const month = getMonthFromDate(event.AA_YMD);
      const rawName = event.EVENT_NM?.trim();
      const name = normalizeEventName(rawName);

      if (!name) continue;

      if (!monthlyEvents[month]) monthlyEvents[month] = [];
      monthlyEvents[month].push(name);
    }

    console.log(`✅ ${code} 일정 수집 완료`);
  } catch (err) {
    console.error(`❌ ${code} 호출 실패:`, err.message);
  }
}

// 🔁 전체 반복 실행
async function run() {
  for (const code of schoolCodes) {
    await fetchSchoolSchedule(code);
  }

  // 📌 중복 제거 + 알파벳 정렬
  for (const month in monthlyEvents) {
    monthlyEvents[month] = [...new Set(monthlyEvents[month])].sort();
  }

  // 📊 요약 출력
  console.log('\n📊 월별 학사일정 요약:');
  for (let m = 1; m <= 12; m++) {
    const events = monthlyEvents[m] || [];
    console.log(`${m}월: ${events.join(', ') || '없음'}`);
  }
}

run();

