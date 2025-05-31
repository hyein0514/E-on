import Header from "../../components/Common/Header";
import ReviewCreateForm from "../../components/Review/ReviewCreateForm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// 임시 더미 데이터 (API 연동 전용)
const dummyReviews = [
  { id: 1, challengeId: 1, title: "정말 유익했어요!", rating: 5, content: "도움됐음", date: "2025-05-30" },
  { id: 2, challengeId: 1, title: "좋은 경험", rating: 4, content: "꽤 괜찮았어요.", date: "2025-05-29" }
];

const ReviewEdit = () => {
  const { challengeId, reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);

  // 실제 서비스에서는 reviewId로 fetch!
  useEffect(() => {
    const found = dummyReviews.find(r => String(r.id) === String(reviewId));
    setReview(found);
  }, [reviewId]);

  if (!review) return <div>로딩중...</div>;

  const handleSubmit = (newReview) => {
    // 실제로는 서버에 PATCH/PUT 요청
    alert("리뷰가 수정되었습니다!");
    navigate(`/challenge/${challengeId}/reviews`);
  };

  return (
    <div>
      <Header />
      <ReviewCreateForm
        challengeId={challengeId}
        // 아래 props는 필요할 때만!
        // initialValue={review}
        // mode="edit"
        // onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ReviewEdit;
