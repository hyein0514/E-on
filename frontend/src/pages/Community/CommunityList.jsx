import { useEffect, useState } from "react";
import Header from "../../components/Common/Header";
import styles from "../../styles/Community/CommunityList.module.css";
import { getBoardPosts, getBoardList } from "../../api/communityApi";

const CommunityList = () => {
  const [tabList, setTabList] = useState([]);
  const [boardIdMap, setBoardIdMap] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 게시판 목록 불러오기
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await getBoardList();
        const boards = response.data;
        const newTabList = boards.map(board => board.board_name);
        const newBoardIdMap = boards.reduce((acc, board) => {
          acc[board.board_name] = board.board_id;
          return acc;
        }, {});
        setTabList(newTabList);
        setBoardIdMap(newBoardIdMap);
        setActiveTab(newTabList[0]); // 첫 번째 탭을 기본 활성화 탭으로 설정
      } catch (error) {
        console.error("게시판 목록 조회 실패:", error);
      }
    };

    fetchBoardList();
  }, []);

  // 게시글 목록 불러오기
useEffect(() => {
  if (!activeTab || !boardIdMap[activeTab]) return;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const boardId = boardIdMap[activeTab];
      const response = await getBoardPosts(boardId);
      setPosts(response.data.map(post => ({
        title: post.title,
        createdAt: post.created_at,
        userId: post.user_id,
        userName: post.User.name
      })));
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [activeTab, boardIdMap]);


  return (
    <div className={styles.container}>
      <Header />

      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        {tabList.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 게시판 공지 */}
      <div className={styles.notice}>
        <span role="img" aria-label="notice">📢</span> 게시판 공지
      </div>

      {/* 게시글 목록 */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.listRow}>불러오는 중...</div>
        ) : posts.length === 0 ? (
          Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className={styles.listRow}></div>
          ))
        ) : (
          posts.map((post, idx) => (
            <div key={idx} className={styles.listRow}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postMeta}>
                작성자: {post.userName} | 작성일: {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <span
            key={idx}
            className={idx === 0 ? styles.activePage : styles.pageNumber}
          >
            {idx + 1}
          </span>
        ))}
        <span className={styles.pageArrow}>&gt;</span>
      </div>

      {/* 게시판 개설 신청 버튼 */}
      <button className={styles.createButton}>게시판 개설 신청</button>
    </div>
  );
};

export default CommunityList;
