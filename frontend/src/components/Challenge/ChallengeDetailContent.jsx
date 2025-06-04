import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa6";

const ChallengeDetailContent = ({ challenge }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const navigate = useNavigate();

  // 1. 상태 한글 변환
  const statusMap = {
    ACTIVE: "모집중",
    CLOSED: "마감",
    CANCELLED: "취소됨",
  };
  const status = statusMap[challenge.challenge_state] || challenge.challenge_state;

  // 2. 날짜 포맷 함수
  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  // 3. 기간 포맷
  const period = challenge.start_date && challenge.end_date
    ? `${formatDate(challenge.start_date)} ~ ${formatDate(challenge.end_date)}`
    : "-";

  // 4. 연령 파싱
  let minAge = "-", maxAge = "-";
  if (challenge.age_range) {
    const m = challenge.age_range.match(/(\d+)\s*~\s*(\d+)/);
    if (m) {
      minAge = m[1];
      maxAge = m[2];
    }
  }

  // 5. 첨부파일(첫번째)
   const imageUrl = (challenge.attachments && challenge.attachments.length > 0)
    ? challenge.attachments[0].url
    : "";


  // 6. 정기/반복
  const isRegular = challenge.is_recuming ? "정기" : "비정기";
  const repeatCycle = challenge.repeat_type === "WEEKLY"
    ? "주 1회"
    : (challenge.repeat_type === "DAILY" ? "매일" : (challenge.repeat_type || ""));
  const daysKorean = (challenge.days || []).map(day => {
    const dayMap = {
      Monday: "월", Tuesday: "화", Wednesday: "수", Thursday: "목",
      Friday: "금", Saturday: "토", Sunday: "일"
    };
    return dayMap[day] || day;
  });

  // 7. 중도참여
  const allowJoinMid = challenge.intermediate_participation ? "허용" : "비허용";

  // 8. 활동분야/키워드
  // 관심분야/진로분야 추출
    const interestsList = (challenge.interests || [])
      .map(i => i.interest_detail)
      .filter(Boolean);

    const visionsList = (challenge.visions || [])
      .map(v => v.vision_detail)
      .filter(Boolean);

    const fieldView = (
      <>
        <div>
          <b>관심</b> : {interestsList.length > 0 ? interestsList.join(", ") : "-"}
        </div>
        <div>
          <b>진로</b> : {visionsList.length > 0 ? visionsList.join(", ") : "-"}
        </div>
      </>
    );



  // 9. 개설자
  const phone =
    challenge.creator && challenge.creator.phone
      ? challenge.creator.phone
      : (challenge.creator_contact || "-");
  const creatorName = challenge.creator?.name || "-";
  const creatorEmail = challenge.creator?.email || "-";

  // 10. 신청 마감일
  const deadline = challenge.application_deadline ? formatDate(challenge.application_deadline) : null;

  // 11. 삭제
  const handleDelete = async () => {
    if (window.confirm("정말로 이 챌린지를 삭제하시겠습니까?")) {
      try {
        // 실제 API 경로에 맞게 고쳐주세요
        await axios.delete(`/api/challenges/${challenge.challenge_id}`);
        alert("챌린지가 삭제되었습니다.");
        navigate("/challenge");
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
            border: status === "모집중" ? "1.5px solid #38bdf8" : "1.5px solid #bbb",
            color: status === "모집중" ? "#38bdf8" : "#bbb",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 8,
            padding: "3.5px 18px"
          }}>
            {status}
          </span>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 25 }}>{challenge.title}</div>
            <div style={{ color: "#666", fontSize: 15, marginTop: 2 }}>
              {period}
              {deadline && <> | 신청 마감 {deadline}</>}
            </div>
          </div>
        </div>
        {/* 오른쪽 버튼 영역 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            onClick={() => navigate(`/attendance/${challenge.challenge_id}`)}
          >
            출석부
          </button>
          {/* 북마크 */}
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
          {/* 신청/취소 */}
          {isJoined ? (
            <button
              style={{
                background: "#f3f3f3",
                color: "#e11d48",
                border: "none",
                borderRadius: 8,
                padding: "9px 28px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer"
              }}
              onClick={() => {
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
                setIsJoined(true);
                alert("신청이 완료되었습니다!");
              }}
            >
              신청하기
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
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
            onClick={() => navigate(`/challenge/${challenge.challenge_id}/edit`)}
          >
            수정
          </button>
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
      {imageUrl && (
        <img
          src={imageUrl}
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
              isRegular === "정기"
                ? <>
                    정기 <span style={{ color: "#444" }}>
                      ({repeatCycle}{daysKorean.length > 0 ? " | " + daysKorean.join(", ") : ""})
                    </span>
                  </>
                : "비정기"
            }
          />
          <InfoRow label="중도참여" value={allowJoinMid} />
          <InfoRow
            label="활동분야"
            value={fieldView}
          />
          <InfoRow label="인원" value={challenge.maximum_people || "-"} />
          <InfoRow label="연령" value={`${minAge} ~ ${maxAge}`} />
          <InfoRow label="사용자" value={creatorName} />
          <InfoRow label="이메일" value={creatorEmail} />
          <InfoRow label="전화번호" value={phone} />
        </div>
        {/* 2열(오른쪽): 리뷰 */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 7,
          }}>
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
                onClick={() => navigate(`/challenge/${challenge.challenge_id}/review/create`)}
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
                onClick={() => navigate(`/challenge/${challenge.challenge_id}/reviews`)}
              >
                더보기
              </button>
            </div>
          </div>
          <div style={{
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            background: "#fafafa",
            minHeight: 38,
            padding: "8px 15px",
          }}>
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
          {challenge.description || "상세 정보가 없습니다."}
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
