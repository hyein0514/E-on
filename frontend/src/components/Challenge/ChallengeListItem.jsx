import { useNavigate } from "react-router-dom";

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
  const toKoreanDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };
  return `${toKoreanDate(start)} ~ ${toKoreanDate(end)}`;
}

const ChallengeListItem = ({
  challenge_id,
  challenge_state,
  title,
  start_date,
  end_date,
  onApply,
  my_participation // <- 추가!
}) => {
  const navigate = useNavigate();

  // 상태 한글 변환
  const statusMap = {
    ACTIVE: "모집중",
    CLOSED: "마감",
    CANCELLED: "취소됨"
  };
  const status = statusMap[challenge_state] || challenge_state;

  // 참여 상태 계산
  const isJoined =
    !!my_participation && my_participation.participating_state !== "취소";
  const participationId = my_participation?.participating_id;
  const participationState = my_participation?.participating_state;

  // 상세페이지로 이동
  const handleGoDetail = () => {
    navigate(`/challenge/${challenge_id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderRadius: "12px",
        border: "2px solid #a3a3a3",
        padding: "12px 16px",
        marginBottom: "17px",
        gap: "26px",
        minHeight: "68px",
        cursor: "pointer"
      }}
      onClick={handleGoDetail}
    >
      {/* 상태 박스 */}
      <div
        style={{
          minWidth: "68px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "15px",
          borderRadius: "8px",
          padding: "7px 0",
          ...statusStyle[status]
        }}
        onClick={e => e.stopPropagation()}
      >
        {status}
      </div>
      {/* 챌린지명 & 날짜 */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "5px" }}>
          {title}
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>{formatDateRange(start_date, end_date)}</div>
      </div>
      {/* 신청하기/참여취소 버튼 */}
      <button
        onClick={e => {
          e.stopPropagation();
          onApply({
            challenge_id,
            isJoined,
            participationId,
            participationState
          });
        }}
        style={{
          background: isJoined ? "#fef2f2" : "#f3f4f6",
          color: isJoined ? "#e11d48" : "#1f2937",
          border: "none",
          borderRadius: "7px",
          padding: "10px 23px",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: "pointer",
          transition: "background 0.15s"
        }}
      >
        {isJoined ? "참여 취소" : "신청하기"}
      </button>
    </div>
  );
};

export default ChallengeListItem;
