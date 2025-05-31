import { useNavigate, useParams } from "react-router-dom";

const ReviewItem = ({ review, onDelete }) => {
  const navigate = useNavigate();
  const { challengeId } = useParams();

  return (
    <div style={{
      border: "1.5px solid #e5e7eb",
      borderRadius: 8,
      padding: "17px 16px",
      marginBottom: 17,
      background: "#fafafb",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <div style={{ fontWeight: "bold" }}>{review.user}</div>
        <div style={{ color: "#888", fontSize: 14, marginBottom: 7 }}>
          평점: {review.rating} | {review.date}
        </div>
        <div>{review.content}</div>
      </div>
      {/* 수정/삭제 버튼 */}
      <div style={{ display: "flex", gap: 4 }}>
        <button
          style={{
            background: "#fff",
            border: "1.5px solid #2563eb",
            color: "#2563eb",
            borderRadius: 8,
            padding: "4px 16px",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer"
          }}
          onClick={() => navigate(`/challenge/${challengeId}/review/${review.id}/edit`)}
        >
          수정
        </button>
        <button
          style={{
            background: "#fff",
            border: "1.5px solid #f87171",
            color: "#e11d48",
            borderRadius: 8,
            padding: "4px 16px",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer"
          }}
          onClick={() => onDelete(review.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;
