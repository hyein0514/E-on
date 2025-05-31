const statusStyle = {
  모집중: {
    color: "#2563eb",
    border: "1.5px solid #bae6fd",
    background: "#f0f9ff"
  },
  마감: {
    color: "#6b7280",
    border: "1.5px solid #d1d5db",
    background: "#f9fafb"
  },
};

function formatDateRange(start, end) {
  // "2025-04-06" ~ "2025-07-06" → "2025년 4월 6일 ~ 2025년 7월 6일"
  const toKoreanDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };
  return `${toKoreanDate(start)} ~ ${toKoreanDate(end)}`;
}

const ChallengeListItem = ({
  status, title, startDate, endDate, onApply
}) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    // boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    border: "2px solid #a3a3a3", 
    padding: "12px 16px",
    marginBottom: "17px",
    gap: "26px",
    minHeight: "68px"
  }}>
    {/* 상태 박스 */}
    <div style={{
      minWidth: "68px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "15px",
      borderRadius: "8px",
      padding: "7px 0",
      ...statusStyle[status] // 동적으로 스타일 지정
    }}>
      {status}
    </div>
    {/* 챌린지명 & 날짜 */}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "5px" }}>{title}</div>
      <div style={{ fontSize: "14px", color: "#6b7280" }}>{formatDateRange(startDate, endDate)}</div>
    </div>
    {/* 신청하기 버튼 */}
    <button
      onClick={onApply}
      style={{
        background: "#f3f4f6",
        color: "#1f2937",
        border: "none",
        borderRadius: "7px",
        padding: "10px 23px",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
        transition: "background 0.15s"
      }}
    >
      신청하기
    </button>
  </div>
);

export default ChallengeListItem;
