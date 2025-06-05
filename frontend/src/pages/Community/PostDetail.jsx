import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Common/Header";
import { getPost } from "../../api/communityApi";
import styles from "../../styles/Community/PostDetail.module.css";

const PostDetail = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(post_id);
        setPost(response.data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPost();
  }, [post_id]);

  if (!post) return <div className={styles.loading}>불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.actions}>
              <button className={styles.editBtn}>수정</button>
              <button className={styles.deleteBtn}>삭제</button>
            </div>
          </div>
          <div className={styles.meta}>
              <span className={styles.author}>{post.User?.name}</span>
              <span className={styles.date}>{new Date(post.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.content}>
          {post.content}
        </div>

        {/* 댓글 부분 */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>댓글</h3>
          {post.Comments && post.Comments.length > 0 ? (
            <ul className={styles.commentList}>
              {post.Comments.map((comment, idx) => (
                <li key={idx} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.User?.name}</span>
                    <span className={styles.commentDate}>{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <div className={styles.commentContent}>{comment.content}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noComments}>댓글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
