// src/pages/reviews/ReviewList.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Common/Header";
import ReviewListSection from "../../components/Review/ReviewListSection";
import { getChallengeReviews } from "../../api/challengeApi";

const ReviewList = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // challengeId가 있을 때만 리뷰 조회
    if (!challengeId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getChallengeReviews(challengeId);
        /* 
          API 응답 형식 예시 (포스트맨에서 가져온 대로):
          [
            {
              review_id: 1,
              rating_stars: 5,
              text: "운동 습관에 큰 도움이 되었어요!",
              is_edited: false,
              review_date: "2025-06-30T20:10:10.000Z",
              user_id: 1,
              challenge_id: 1,
              writer: {
                user_id: 1,
                name: "김하린"
              }
            },
            ...
          ]
        */
        // 그대로 상태에 담아두면, ReviewListSection에서 필요한 필드를 꺼내 쓰면 됩니다.
        setReviews(res.data);
      } catch (e) {
        console.error("리뷰 조회 오류:", e);
        setError("리뷰를 불러오는 중 오류가 발생했습니다.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [challengeId]);

  return (
    <div>
      <Header />

      <div
        style={{
          maxWidth: 700,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 12,
          padding: "32px 28px",
          boxShadow: "0 2px 10px #eee",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>
            리뷰 목록
          </h2>
          <button
            style={{
              background: "#f3f3f3",
              border: "1.5px solid #e5e7eb",
              color: "#2563eb",
              borderRadius: 7,
              fontWeight: "bold",
              fontSize: 16,
              padding: "9px 24px",
              cursor: "pointer",
            }}
            onClick={() =>
              navigate(`/challenge/${challengeId}/review/create`)
            }
          >
            리뷰 작성
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#888", padding: 50 }}>
            리뷰 불러오는 중…
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "red", padding: 50 }}>
            {error}
          </div>
        ) : (
          <ReviewListSection reviews={reviews} />
        )}
      </div>
    </div>
  );
};

export default ReviewList;
