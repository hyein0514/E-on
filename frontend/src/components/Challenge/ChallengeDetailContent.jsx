import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa6";

const ChallengeDetailContent = ({ challenge }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [status, setStatus] = useState(challenge.status);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("정말로 이 챌린지를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/challenges/${challenge.id}`);
        alert("챌린지가 삭제되었습니다.");
        navigate("/challenge"); // 챌린지 목록으로 이동
      } catch (e) {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div style={{
      maxWidth: 1040,
      margin: "44px auto",
      background: "#fff",
      border: "1.5px solid #e5e7eb",
      borderRadius: 14,
      padding: 36,
      color: "#222"
    }}>
      {/* 상단 header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            border: challenge.status === "모집중" ? "1.5px solid #38bdf8" : "1.5px solid #bbb",
            color: challenge.status === "모집중" ? "#38bdf8" : "#bbb",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 8,
            padding: "3.5px 18px"
          }}>
            {challenge.status}
          </span>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 25 }}>{challenge.title}</div>
            <div style={{ color: "#666", fontSize: 15, marginTop: 2 }}>
              {challenge.startDate} ~ {challenge.endDate}
              {challenge.deadline && <> | 신청 마감 {challenge.deadline}</>}
            </div>
          </div>
        </div>
        {/* 오른쪽 버튼 영역 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* 출석부 버튼 */}
          <button
            style={{
              background: "#f9fafb",
              color: "#2563eb",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              padding: "7px 20px",
              fontWeight: "bold",
              fontSize: 15,
              cursor: "pointer"
            }}
            onClick={() => navigate(`/attendance/${challenge.id}`)}
          >
            출석부
          </button>
          {/* 북마크 아이콘 */}
          <button
            onClick={() => setBookmarked(b => !b)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 4
            }}
          >
            <FaBookmark size={25} color={bookmarked ? "#38bdf8" : "#bbb"} />
          </button>
          {/* 신청하기 버튼 */}
            {isJoined ? (
              <button
                style={{
                  background: "#f3f3f3",
                  color: "#e11d48", // 취소니까 약간 빨간색 계열 추천 (선택)
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 28px",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer"
                }}
                onClick={() => {
                  // 서버에 취소 API 요청 후...
                  setIsJoined(false);
                  alert("참여가 취소되었습니다!");
                }}
              >
                참여 취소
              </button>
            ) : (
              <button
                style={{
                  background: "#e5e7eb",
                  color: "#222",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 28px",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer"
                }}
                onClick={() => {
                  // 서버에 신청 API 요청 후...
                  setIsJoined(true);
                  alert("신청이 완료되었습니다!");
                }}
              >
                신청하기
              </button>
            )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
  {/* 수정 버튼 */}
        <button
          style={{
            background: "#fff",
            border: "1.5px solid #2563eb",
            color: "#2563eb",
            borderRadius: 8,
            padding: "8px 22px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer"
          }}
          onClick={() => navigate(`/challenge/${challenge.id}/edit`)}
        >
          수정
        </button>
        {/* 삭제 버튼 */}
        <button
          style={{
            background: "#fff",
            border: "1.5px solid #f87171",
            color: "#e11d48",
            borderRadius: 8,
            padding: "8px 22px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer"
          }}
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>

      </div>

      {/* 이미지 */}
      {challenge.imageUrl && (
        <img
          src={challenge.imageUrl}
          alt="챌린지 이미지"
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: 13,
            marginBottom: 25
          }}
        />
      )}

      {/* 2단 영역 */}
      <div style={{ display: "flex", gap: 34, marginBottom: 26 }}>
        {/* 1열(왼쪽): 정보 */}
        <div style={{ flex: 1.1 }}>
          <InfoRow
            label="정기여부"
            value={
              challenge.isRegular === "정기"
                ? <>
                    정기 <span style={{ color: "#444" }}>({challenge.repeatCycle}{challenge.days && challenge.days.length > 0 ? " | " + challenge.days.join(", ") : ""})</span>
                  </>
                : "비정기"
            }
          />
          <InfoRow
            label="중도참여"
            value={challenge.allowJoinMid}
          />
          <InfoRow
            label="활동분야"
            value={
              <>
                {challenge.field}
                {challenge.keywords && challenge.keywords.length > 0 && (
                  <span style={{ marginLeft: 7, color: "#888" }}>
                    ({challenge.keywords.join(", ")})
                  </span>
                )}
              </>
            }
          />
          <InfoRow
            label="인원"
            value={challenge.limit ? challenge.limit : "-"}
          />
          <InfoRow
            label="연령"
            value={`${challenge.minAge} ~ ${challenge.maxAge}`}
          />
          <InfoRow
            label="사용자"
            value={challenge.userName || "-"}
          />
          <InfoRow
            label="이메일"
            value={challenge.email || "-"}
          />
          <InfoRow
            label="전화번호"
            value={challenge.phone || "-"}
          />
        </div>
        {/* 2열(오른쪽): 리뷰 */}
        <div style={{ flex: 1 }}>
          {/* 리뷰 헤더: flex로 묶어서 버튼 오른쪽에 배치 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 16 }}>리뷰</div>
            <div>
              <button
                style={{
                  marginRight: 7,
                  background: "#f3f3f3",
                  border: "1.5px solid #e5e7eb",
                  color: "#2563eb",
                  borderRadius: 7,
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: "7px 18px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/challenge/${challenge.id}/review/create`)}
              >
                리뷰 작성
              </button>
              <button
                style={{
                  background: "#f3f3f3",
                  border: "1.5px solid #e5e7eb",
                  color: "#888",
                  borderRadius: 7,
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: "7px 18px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/challenge/${challenge.id}/reviews`)}
              >
                더보기
              </button>
            </div>
          </div>
          <div
            style={{
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              background: "#fafafa",
              minHeight: 38,
              padding: "8px 15px",
            }}
          >
            (리뷰 리스트 자리)
          </div>
        </div>
      </div>

      {/* 상세설명 */}
      <div>
        <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>상세정보</div>
        <div style={{
          border: "1.5px solid #e5e7eb",
          borderRadius: 13,
          background: "#fafafd",
          padding: "28px 20px",
          minHeight: 110,
          fontSize: 17
        }}>
          {challenge.content || "상세 정보가 없습니다."}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", marginBottom: 8 }}>
    <div style={{ width: 90, color: "#444", fontWeight: 500 }}>{label}</div>
    <div>{value}</div>
  </div>
);

export default ChallengeDetailContent;
