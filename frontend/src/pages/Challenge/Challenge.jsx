import { useState } from "react";
import Header from "../../components/Common/Header";
import styles from "../../styles/Pages/Challenge.module.css";
import ChallengeSearchSection from "../../components/Challenge/ChallengeSearchSelection"
import ChallengeList from "../../components/Challenge/ChallengeList";
import Pagination from "../../components/Challenge/Pagination";

// 임시 데이터
const dummyData = [
  {
    id: 1,
    status: "모집중",
    title: "리액트 완전정복 챌린지",
    startDate: "2025-04-06",
    endDate: "2025-07-06"
  },
  {
    id: 2,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
  {
    id: 3,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
  {
    id: 4,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
  {
    id: 5,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
  {
    id: 6,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
  {
    id: 7,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
  {
    id: 8,
    status: "마감",
    title: "알고리즘 마스터",
    startDate: "2025-01-10",
    endDate: "2025-03-10"
  },
];

 const itemsPerPage = 5; // 한 페이지에 보여줄 챌린지 개수

const Challenge = () => {
  // 1. 검색/필터 상태 상위에서 관리!
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 예시: 상태 필터
  const [currentPage, setCurrentPage] = useState(1);
 

  const handleSearch = () => {
    // 검색 버튼 클릭 시 동작
    // 실제로는 API 호출/리스트 필터링
    alert(`검색: ${search}, 상태필터: ${filter}`);
  };

  const handleApply = (id) => {
    alert(`${id}번 챌린지 신청!`);
  };

  // 나중에 실제 필터링을 할 땐 여기서 필터링해서 내려주면 됨
  const filteredChallenges = dummyData.filter(challenge => {
    // 상태필터 'all'이면 전체, 아니면 일치하는 상태만
    if (filter !== 'all' && challenge.status !== filter) return false;
    // 검색어 있으면 제목에 포함되어야 함
    if (search && !challenge.title.includes(search)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);
  const pageChallenges = filteredChallenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 만약 서버 페이징이면 여기서 API 호출
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <ChallengeSearchSection
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        onSearch={handleSearch}
      />
      <ChallengeList challenges={pageChallenges} onApply={handleApply} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Challenge;