import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Common/Header";
import {
    getPost,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
} from "../../api/communityApi";
import styles from "../../styles/Community/PostDetail.module.css";
import { toast } from "react-toastify";

const PostDetail = () => {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedPostTitle, setEditedPostTitle] = useState("");
    const [editedPostContent, setEditedPostContent] = useState("");

    const fetchPost = async () => {
        try {
            const response = await getPost(post_id);
            setPost(response.data);
        } catch (error) {
            console.error("게시글 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [post_id]);

    const handleSubmitComment = async () => {
        if (!newComment.trim())
            return toast("댓글을 입력해주세요.", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        try {
            setIsSubmitting(true);
            await createComment(post.post_id, {
                content: newComment,
            });
            setNewComment("");
            fetchPost();
        } catch (err) {
            console.error("댓글 등록 실패", err);
            toast("댓글 작성 중 오류 발생", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (comment) => {
        setEditingCommentId(comment.comment_id);
        setEditedContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedContent("");
    };

    const handleSaveClick = async () => {
        if (!editedContent.trim())
            return toast("내용을 입력해주세요.", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        try {
            await updateComment(editingCommentId, { content: editedContent });
            toast("댓글이 수정되었습니다.", {
                icon: "💜",
                style: {
                    background: "#f7f8fc",
                    color: "#2d2d2d",
                    borderLeft: "4px solid #b37bd6",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
            setEditingCommentId(null);
            fetchPost();
        } catch (err) {
            console.error("댓글 수정 실패", err);
            toast("수정 중 오류가 발생했습니다.", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete =
            window.confirm("정말 이 댓글을 삭제하시겠습니까?");
        if (!confirmDelete) return;
        try {
            await deleteComment(commentId);
            toast("댓글이 삭제되었습니다.", {
                icon: "💜",
                style: {
                    background: "#f7f8fc",
                    color: "#2d2d2d",
                    borderLeft: "4px solid #b37bd6",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
            fetchPost();
        } catch (err) {
            console.error("댓글 삭제 실패", err);
            toast("댓글 삭제 중 오류가 발생했습니다.", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        }
    };

    const handleDeletePost = async () => {
        const confirmDelete = window.confirm(
            "정말 이 게시글을 삭제하시겠습니까?"
        );
        if (!confirmDelete) return;
        try {
            await deletePost(post_id);
            toast("게시글이 삭제되었습니다.", {
                icon: "💜",
                style: {
                    background: "#f7f8fc",
                    color: "#2d2d2d",
                    borderLeft: "4px solid #b37bd6",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
            navigate("/community");
        } catch (err) {
            console.error("게시글 삭제 실패", err);
            toast("게시글 삭제 중 오류가 발생했습니다.", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        }
    };

    const handlePostEdit = () => {
        setIsEditingPost(true);
        setEditedPostTitle(post.title);
        setEditedPostContent(post.content);
    };

    const handleCancelPostEdit = () => {
        setIsEditingPost(false);
        setEditedPostTitle("");
        setEditedPostContent("");
    };

    const handleSavePostEdit = async () => {
        try {
            await updatePost(post_id, {
                title: editedPostTitle,
                content: editedPostContent,
            });
            toast("게시글이 수정되었습니다.", {
                icon: "💜",
                style: {
                    background: "#f7f8fc",
                    color: "#2d2d2d",
                    borderLeft: "4px solid #b37bd6",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
            setIsEditingPost(false);
            fetchPost();
        } catch (err) {
            console.error("게시글 수정 실패", err);
            toast("게시글 수정 중 오류가 발생했습니다.", {
                icon: "⚠️",
                style: {
                    background: "#fff3f3",
                    color: "#842029",
                    borderLeft: "4px solid #ff6b6b",
                    fontWeight: "bold",
                },
                progressClassName: "custom-progress-bar",
            });
        }
    };

    if (!post) return <div className={styles.loading}>불러오는 중...</div>;

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        {isEditingPost ? (
                            <input
                                className={styles.editPostTitleInput}
                                value={editedPostTitle}
                                onChange={(e) =>
                                    setEditedPostTitle(e.target.value)
                                }
                            />
                        ) : (
                            <h1 className={styles.title}>{post.title}</h1>
                        )}
                        {user?.user_id === post.user_id && (
                            <div className={styles.actions}>
                                {isEditingPost ? (
                                    <>
                                        <button
                                            className={styles.editBtn}
                                            onClick={handleSavePostEdit}>
                                            저장
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={handleCancelPostEdit}>
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={styles.editBtn}
                                            onClick={handlePostEdit}>
                                            수정
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={handleDeletePost}>
                                            삭제
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.meta}>
                        <span className={styles.author}>{post.User?.name}</span>
                        <span className={styles.date}>
                            {new Date(post.created_at).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className={styles.content}>
                    {isEditingPost ? (
                        <textarea
                            className={styles.editPostContentTextarea}
                            value={editedPostContent}
                            onChange={(e) =>
                                setEditedPostContent(e.target.value)
                            }
                        />
                    ) : (
                        post.content
                    )}
                </div>

                <div className={styles.commentsSection}>
                    <h3 className={styles.commentsTitle}>댓글</h3>
                    {post.Comments && post.Comments.length > 0 ? (
                        <ul className={styles.commentList}>
                            {post.Comments.map((comment) => (
                                <li
                                    key={comment.comment_id}
                                    className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <div className={styles.commentInfo}>
                                            <span
                                                className={
                                                    styles.commentAuthor
                                                }>
                                                {comment.User?.name}
                                            </span>
                                            <span
                                                className={styles.commentDate}>
                                                {new Date(
                                                    comment.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        {user?.user_id === comment.user_id &&
                                            editingCommentId !==
                                                comment.comment_id && (
                                                <div
                                                    className={
                                                        styles.commentButtons
                                                    }>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                comment
                                                            )
                                                        }
                                                        className={
                                                            styles.commentEditBtn
                                                        }>
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment.comment_id
                                                            )
                                                        }
                                                        className={
                                                            styles.commentDeleteBtn
                                                        }>
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                    {editingCommentId === comment.comment_id ? (
                                        <div className={styles.commentEditBox}>
                                            <textarea
                                                value={editedContent}
                                                onChange={(e) =>
                                                    setEditedContent(
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    styles.commentEditTextarea
                                                }
                                            />
                                            <div
                                                className={
                                                    styles.commentEditButtons
                                                }>
                                                <button
                                                    onClick={handleSaveClick}
                                                    className={
                                                        styles.commentSaveBtn
                                                    }>
                                                    저장
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className={
                                                        styles.commentCancelBtn
                                                    }>
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.commentContent}>
                                            {comment.content}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noComments}>댓글이 없습니다.</p>
                    )}
                </div>

                <div className={styles.commentForm}>
                    <textarea
                        className={styles.commentTextarea}
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className={styles.commentButton}
                        onClick={handleSubmitComment}
                        disabled={isSubmitting}>
                        {isSubmitting ? "작성 중..." : "등록"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
