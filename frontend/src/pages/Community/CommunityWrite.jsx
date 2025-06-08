import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/Community/CommunityWrite.module.css";
import Header from "../../components/Common/Header";
import { createPost } from "../../api/communityApi";

const CommunityWrite = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const { board_id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
        }

        try {
        setIsSubmitting(true);
        const response = await createPost(board_id, {
            user_id: 1, // JWT 사용 시 대체 예정
            title,
            content,
        });

        alert("게시글이 등록되었습니다.");
        navigate("/community"); // 작성 후 커뮤니티 목록으로 이동
        } catch (error) {
        console.error("게시글 작성 실패:", error);
        alert("게시글 등록 중 오류가 발생했습니다.");
        } finally {
        setIsSubmitting(false);
        }
    };

    
    return (
        <>
            <div className={styles.headerWrapper}>
                <Header />
            </div>

            <div className={styles.container}>
                <div className={styles.formWrapper}>
                <h2 className={styles.title}>글쓰기</h2>

                <label className={styles.label}>제목</label>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className={styles.label}>내용</label>
                    <textarea
                        placeholder="내용을 입력하세요"
                        className={styles.textarea}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    <button
                        className={styles.submitButton}
                        type="submit"
                        disabled={isSubmitting}>{isSubmitting ? "등록 중..." : "등록하기"}</button>

                </form>
                </div>
            </div>
        </>
    );
};

export default CommunityWrite;
