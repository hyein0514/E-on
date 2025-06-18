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

function formatDateRange(start, end) { /* ... */ }

const ChallengeListItem = ({
  challenge_id,
  challenge_state,
  title,
  start_date,
  end_date,
  onApply,
  my_participation,
  age_range,  
  minimum_age,
  maximum_age,      
  userAge
}) => {
  const navigate = useNavigate();

  // ① challenge_state → 한국어
  const statusMap = { ACTIVE: "모집중", CLOSED: "마감", CANCELLED: "취소됨" };
  const status = statusMap[challenge_state] || challenge_state;

  // ② 참여 여부
  const isJoined =
    !!my_participation && my_participation.participating_state !== "취소";
  const participationId = my_participation?.participating_id;
  const participationState = my_participation?.participating_state;

  // 나이 파싱
  let minAge = minimum_age ?? null;
  let maxAge = maximum_age ?? null;

  if ((minAge === null || maxAge === null) && typeof age_range === "string" && age_range.trim() !== "") {
    const m = age_range.match(/(\d+)\s*~\s*(\d+)/);
    if (m) {
      minAge = Number(m[1]);
      maxAge = Number(m[2]);
    }
  }

  const canJoinByAge =
    userAge == null || minAge == null || maxAge == null
      ? true
      : userAge >= minAge && userAge <= maxAge;
  console.log("userAge", userAge, "minAge", minAge, "maxAge", maxAge);




  // ③ 상세 페이지 이동 함수
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
      onClick={handleGoDetail}   // ← 이 부분이 있어야 클릭 시 디테일로 이동
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
        onClick={(e) => e.stopPropagation()} // 상태 박스 클릭은 디테일 이동 방지
      >
        {status}
      </div>

      {/* 챌린지명 & 날짜 */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "5px" }}>
          {title}
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          {formatDateRange(start_date, end_date)}
        </div>
      </div>

      {/* 신청하기/참여취소 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!canJoinByAge) {
            alert(`${minAge}~${maxAge}세만 신청 가능`);
            return;
          }
          onApply({
            challenge_id,
            isJoined,
            participationId,
            participationState
          });
        }}
        disabled={!canJoinByAge}
        style={{
          background: !canJoinByAge
            ? "#eee"
            : isJoined
            ? "#fef2f2"
            : "#f3f4f6",
          color: !canJoinByAge
            ? "#bbb"
            : isJoined
            ? "#e11d48"
            : "#1f2937",
          border: "none",
          borderRadius: "7px",
          padding: "10px 23px",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: !canJoinByAge ? "not-allowed" : "pointer",
          transition: "background 0.15s"
        }}
      >
        {!canJoinByAge
          ? `${minAge}~${maxAge}세만 신청 가능`
          : isJoined
          ? "참여 취소"
          : "신청하기"}
      </button>
    </div>
  );
};

export default ChallengeListItem;
