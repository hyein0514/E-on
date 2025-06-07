// src/pages/reviews/ReviewEdit.jsx

import Header from "../../components/Common/Header";
import ReviewCreateForm from "../../components/Review/ReviewCreateForm";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeReviews, updateReview } from "../../api/challengeApi";
import { useEffect, useState } from "react";

const ReviewEdit = () => {
  const { challengeId, reviewId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) 페이지 진입 시: reviewId에 해당하는 리뷰 하나만 가져오기
  useEffect(() => {
    const fetchOneReview = async () => {
      setLoading(true);
      try {
        // 현재 API는 “챌린지 전체 리뷰 목록”을 반환하므로, 리스트에서 해당 reviewId만 골라냅니다.
        const res = await getChallengeReviews(challengeId);
        const found = res.data.find(
          (r) => String(r.review_id) === String(reviewId)
        );

        if (!found) {
          alert("해당 리뷰를 찾을 수 없습니다.");
          navigate(`/challenge/${challengeId}/reviews`);
          return;
        }

        setInitialData(found);
      } catch (e) {
        console.error("리뷰 조회 오류:", e);
        alert("리뷰를 불러오는 데 실패했습니다.");
        navigate(`/challenge/${challengeId}/reviews`);
      } finally {
        setLoading(false);
      }
    };

    fetchOneReview();
  }, [challengeId, reviewId, navigate]);

  // 2) form 제출 시: updateReview 호출
  const handleEdit = async ({ rating_stars, text }) => {
    setLoading(true);
    try {
      await updateReview(reviewId, { rating_stars, text });
      alert("리뷰가 수정되었습니다!");
      navigate(`/challenge/${challengeId}/reviews`);
    } catch (e) {
      console.error("리뷰 수정 오류:", e);
      alert("리뷰 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로딩중 또는 데이터가 없으면 화면에 로딩 메시지
  if (loading || !initialData) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>로딩 중…</div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0',paddingLeft: '150px' }}>
          <Header />
        </div>
      <ReviewCreateForm
        challengeId={challengeId}
        mode="edit"
        initialData={initialData}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default ReviewEdit;
