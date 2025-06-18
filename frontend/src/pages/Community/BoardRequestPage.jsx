import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoardRequest } from "../../api/communityApi";
import Header from "../../components/Common/Header";
import styles from "../../styles/Community/BoardRequestPage.module.css";

const BoardRequestPage = () => {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [boardType, setBoardType] = useState("일반");
  const [boardAudience, setBoardAudience] = useState("student"); // ✅ 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim() || !description.trim()) {
      return alert("게시판 이름과 설명을 모두 입력해주세요.");
    }

    try {
      setIsSubmitting(true);
      await createBoardRequest({
        requested_board_name: boardName,
        request_reason: description,
        requested_board_type: boardType,
        board_audience: boardAudience,
      });
      alert("게시판 개설 요청이 제출되었습니다.");
      navigate("/community");
    } catch (err) {
      console.error("게시판 개설 요청 실패", err);
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.module}>
        <div className={styles.page}>
          <h2 className={styles.title}>게시판 개설 신청</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>게시판 이름</label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className={styles.input}
              placeholder="예: 자유게시판"
            />

            <label className={styles.label}>게시판 유형</label>
            <select
              value={boardType}
              onChange={(e) => setBoardType(e.target.value)}
              className={styles.select}
            >
              <option value="일반">일반</option>
              <option value="스터디">스터디</option>
              <option value="QnA">QnA</option>
              <option value="홍보">홍보</option>
            </select>

            <label className={styles.label}>대상</label>
            <select
              value={boardAudience}
              onChange={(e) => setBoardAudience(e.target.value)}
              className={styles.select} // ✅ 기존 스타일 재사용
            >
              <option value="student">학생용</option>
              <option value="parent">학부모용</option>
            </select>

            <label className={styles.label}>설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="게시판의 목적이나 용도를 설명해주세요."
            />

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "제출 중..." : "제출"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BoardRequestPage;
