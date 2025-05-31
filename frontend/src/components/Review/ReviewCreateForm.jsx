import { useState } from "react";

const ReviewCreateForm = ({ challengeId }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`리뷰 등록!\n별점: ${rating}\n제목: ${title}\n내용: ${content}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "80vw",             // 화면 80%
        maxWidth: 1100,            // 최대 1100px
        margin: "40px auto",
        background: "#fff",
        borderRadius: 14,
        padding: "46px 54px 38px 54px",
        boxShadow: "0 2px 12px #f3f4f6",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div style={{
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 36,
        textAlign: "left",
        letterSpacing: "-1px"
      }}>
        리뷰 작성
      </div>

      {/* 리뷰 타이틀 & 별점 */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 18 }}>리뷰</div>
        <div>
          {[1,2,3,4,5].map(num => (
            <span
              key={num}
              style={{
                fontSize: 54,
                color: num <= rating ? "#facc15" : "#e5e7eb",
                cursor: "pointer",
                margin: "0 10px"
              }}
              onClick={() => setRating(num)}
              role="button"
              aria-label={`${num}점`}
            >★</span>
          ))}
        </div>
      </div>

      {/* 제목 입력 */}
      <input
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 8,
          border: "1.5px solid #e5e7eb",
          fontSize: 17,
          marginBottom: 18,
          background: "#fafafa"
        }}
        type="text"
        placeholder="리뷰 제목을 입력하세요."
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      {/* 내용 입력 */}
      <textarea
        style={{
          width: "100%",
          minHeight: 160,
          border: "1.5px solid #e5e7eb",
          borderRadius: 8,
          padding: "17px 16px",
          fontSize: 17,
          marginBottom: 32,
          background: "#fafafa",
          resize: "vertical"
        }}
        placeholder="리뷰 내용을 입력하세요."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />

      {/* 저장 버튼 */}
      <button
        type="submit"
        style={{
          width: "180px",
          display: "block",
          margin: "0 auto",
          background: "#d4d4d4",
          color: "#222",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 19,
          padding: "13px 0",
          cursor: "pointer",
          letterSpacing: 2
        }}
        disabled={rating === 0 || title.trim() === "" || content.trim() === ""}
      >
        저장
      </button>
    </form>
  );
};

export default ReviewCreateForm;
