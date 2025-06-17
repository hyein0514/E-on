// src/pages/reviews/ReviewCreate.jsx

import Header from "../../components/Common/Header";
import ReviewCreateForm from "../../components/Review/ReviewCreateForm";
import { useParams, useNavigate } from "react-router-dom";
import { createReview } from "../../api/challengeApi";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const ReviewCreate = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // 폼이 제출되면 API 호출
  const handleCreate = async ({ rating_stars, text }) => {
    setLoading(true);
    try {
      await createReview(challengeId, {
        user_id: user.user_id,
        rating_stars,
        text,
      });
      alert("리뷰가 등록되었습니다!");
      navigate(`/challenge/${challengeId}/reviews`);
    } catch (e) {
      console.error("리뷰 작성 오류:", e);
      alert("리뷰 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0',paddingLeft: '150px' }}>
          <Header />
        </div>
      <ReviewCreateForm challengeId={challengeId} onSubmit={handleCreate} />
      {loading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>저장 중…</div>
      )}
    </div>
  );
};

export default ReviewCreate;
