import { useState } from "react";
import ReviewItem from "./ReviewItem";

const ReviewListSection = ({ reviews: initialReviews }) => {
  // 리뷰 목록 상태 관리
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = (id) => {
    if (window.confirm("정말로 이 리뷰를 삭제할까요?")) {
      setReviews(reviews.filter(r => r.id !== id));
      // 실제 서버 연동 시엔 API 호출 후 setReviews!
    }
  };

  if (!reviews || reviews.length === 0) {
    return <div style={{ color: "#aaa", textAlign: "center", padding: "50px 0" }}>아직 등록된 리뷰가 없습니다.</div>;
  }

  return (
    <div>
      {reviews.map(review => (
        <ReviewItem key={review.id} review={review} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default ReviewListSection;
