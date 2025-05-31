import Header from "../../components/Common/Header";
import ReviewListSection from "../../components/Review/ReviewListSection";
import { useParams, useNavigate } from "react-router-dom";

const dummyReviews = [
  { id: 1, challengeId: 1, user: "홍길동", rating: 5, content: "정말 유익했어요!", date: "2025-05-30" },
  { id: 2, challengeId: 1, user: "이서윤", rating: 4, content: "좋은 경험이었습니다.", date: "2025-05-29" },
  { id: 3, challengeId: 2, user: "박현우", rating: 3, content: "무난했어요.", date: "2025-05-29" },
];

const ReviewList = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  // 현재 챌린지에 해당하는 리뷰만!
  const filteredReviews = dummyReviews.filter(
    review => String(review.challengeId) === String(challengeId)
  );

  return (
    <div>
      <Header />
      <div style={{
        maxWidth: 700,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        padding: "32px 28px",
        boxShadow: "0 2px 10px #eee"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>리뷰 목록</h2>
          <button
            style={{
              background: "#f3f3f3",
              border: "1.5px solid #e5e7eb",
              color: "#2563eb",
              borderRadius: 7,
              fontWeight: "bold",
              fontSize: 16,
              padding: "9px 24px",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/challenge/${challengeId}/review/create`)}
          >
            리뷰 작성
          </button>
        </div>
        <ReviewListSection reviews={filteredReviews} />
      </div>
    </div>
  );
};


export default ReviewList;
