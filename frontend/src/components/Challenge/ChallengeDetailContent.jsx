import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { FaBookmark } from "react-icons/fa6";
import {
  participateChallenge,
  cancelParticipation,
  addBookmark,
  removeBookmark,
  deleteChallenge,
  getChallengeReviews,   // ★ 추가
} from "../../api/challengeApi";

// 리뷰 하나를 보여줄 때 사용하는 컴포넌트 (간단한 예시)
const ReviewPreview = ({ reviewerName, rating, comment, date }) => {
  const formatted = date ? date.split("T")[0] : "-"; 
  return (
    <div style={{
      borderBottom: "1px solid #e5e7eb",
      padding: "8px 0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{reviewerName}</span>
        <span style={{ color: "#888", fontSize: 12 }}>{formatted}</span>
      </div>
      <div style={{ marginBottom: 4 }}>
        {/* ★ rating이 0이 아니라면 별표로 표시 */}
        {rating > 0 ? (
          <span style={{ color: "#f59e0b", fontSize: 14 }}>
            {"★".repeat(rating)}
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: 14, color: "#333" }}>
        {comment || "(리뷰 내용이 없습니다.)"}
      </div>
    </div>
  );
};

const ChallengeDetailContent = ({
  challenge,
  bookmarked,
  setBookmarked,
  userId,
  isJoined,
  setIsJoined,
  participationId,
  setParticipationId,
  participationState,
  refresh,
}) => {

  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

   useEffect(() => {
    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
          const res = await getChallengeReviews(challenge.challenge_id);
          const data = res.data.map((r) => ({
            id: r.review_id,
            reviewerName: r.writer?.name || `유저${r.user_id}`,      // 현재는 user_id만 내려옴 → 임시로 ‘유저1’ 식으로 표기
            rating: r.rating_stars,               // 별점
            comment: r.text,                      // 리뷰 텍스트
            date: r.review_date,                  // ISO 문자열
          }));
          setReviews(data);
        } catch (e) {
          console.error("리뷰 조회 실패:", e);
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
      };

      fetchReviews();
    }, [challenge.challenge_id]);

    const handleCancel = async () => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
          if (!participationId) {
            alert("참여 기록이 없습니다.");
            setActionLoading(false);
            return;
          }
          // 참여취소 API 호출
          await cancelParticipation(participationId);
          alert("참여가 취소되었습니다.");
          await new Promise(res => setTimeout(res, 300));
          await refresh();
        } catch (error) {
          alert("참여 취소 중 오류가 발생했습니다.");
          console.log(error);
        }
        setActionLoading(false);
      };

    const handleJoin = async () => {
      if (actionLoading) return;
      setActionLoading(true);

      // participationState '취소'일 때의 로직
      if (participationId && participationState === '취소') {
    try {
      await cancelParticipation(participationId);
      await new Promise(res => setTimeout(res, 200));
    } catch (e) {
      // 이미 취소 상태 등으로 삭제 실패해도 무시
      console.log('참여취소 에러(무시)', e);
    }
    try {
      await participateChallenge(challenge.challenge_id, { user_id: userId });
      alert("참여가 완료되었습니다!");
      await new Promise(res => setTimeout(res, 300));
      await refresh();
    } catch (error) {
      alert("참여 중 오류가 발생했습니다.");
    }
    setActionLoading(false);
    return;
  }
      // 평상시 참여/취소 플로우
      try {
        if (isJoined) {
          await handleCancel();
          setActionLoading(false);
          return;
        }
        await participateChallenge(challenge.challenge_id, { user_id: userId });
        alert("참여가 완료되었습니다!");
        await new Promise(res => setTimeout(res, 300));
        await refresh();
      } catch (error) {
        if (error.response?.status === 409) {
          alert("이미 참여한 상태입니다. 다시 시도합니다.");
          await refresh();
        } else {
          alert("참여 중 오류가 발생했습니다.");
        }
      }
      setActionLoading(false);
    };


  // 1. 상태 한글 변환
  const statusMap = {
    ACTIVE: "모집중",
    CLOSED: "마감",
    CANCELLED: "취소됨",
  };
  const status = statusMap[challenge.challenge_state] || challenge.challenge_state;

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

// 3. 기간 포맷
const period =
  challenge.duration && challenge.duration.start && challenge.duration.end
    ? `${formatDate(challenge.duration.start)} ~ ${formatDate(challenge.duration.end)}`
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
        await deleteChallenge(challenge.challenge_id);
        alert("챌린지가 삭제되었습니다.");
        navigate("/challenge"); // 목록 페이지로 이동
      } catch (e) {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 북마크 토글 함수
const toggleBookmark = async () => {
  const userId = 1; // 테스트용 하드코딩 or 로그인된 유저 아이디로 바꿔야 함
  try {
    if (bookmarked) {
      await removeBookmark(challenge.challenge_id, userId);
      setBookmarked(false);
      alert("북마크가 해제되었습니다!");
    } else {
      await addBookmark(challenge.challenge_id, userId);
      setBookmarked(true);
      alert("북마크에 추가되었습니다!");
    }
  } catch (e) {
    if (e.response && e.response.status === 409) {
      setBookmarked(true);
      alert("이미 북마크되어 있습니다!");
    } else {
      alert("북마크 처리 중 오류가 발생했습니다.");
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
            onClick={toggleBookmark}
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
          <button
              style={{
                background: isJoined ? "#f3f3f3" : "#e5e7eb",
                color: isJoined ? "#e11d48" : "#222",
                border: "none",
                borderRadius: 8,
                padding: "9px 28px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer"
              }}
               onClick={isJoined ? handleCancel : handleJoin}
            >
              {isJoined ? "참여 취소" : "신청하기"}
            </button>
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

          {/* ── 실제 리뷰를 최대 3개만 미리 보여주는 영역 ── */}
          <div
            style={{
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              background: "#fafafa",
              minHeight: 80,
              padding: "8px 15px",
            }}
          >
            {reviewsLoading ? (
              <div style={{ textAlign: "center", color: "#888" }}>
                리뷰 불러오는 중…
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ color: "#666", fontSize: 14 }}>
                등록된 리뷰가 없습니다.
              </div>
            ) : (
              // 리뷰가 하나라도 있으면, 앞의 3개만 보여준다
              reviews.slice(0, 3).map((rv) => (
                <ReviewPreview
                  key={rv.id}
                  reviewerName={rv.reviewerName}
                  rating={rv.rating}
                  comment={rv.comment}
                  date={rv.date}
                />
              ))
            )}
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
