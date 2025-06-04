import { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import styles from "../../styles/Pages/Challenge.module.css";
import ChallengeSearchSection from "../../components/Challenge/ChallengeSearchSelection"
import ChallengeList from "../../components/Challenge/ChallengeList";
import Pagination from "../../components/Challenge/Pagination";
import { getChallengeList } from "../../api/challengeApi";

 const itemsPerPage = 5; // 한 페이지에 보여줄 챌린지 개수

const Challenge = () => {

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 예시: 상태 필터
  const [currentPage, setCurrentPage] = useState(1);

  const [challenges, setChallenges] = useState([]); // 서버에서 받은 리스트
  const [totalCount, setTotalCount] = useState(0); // 전체 개수(서버에서 페이징할 때 필요)
  const [loading, setLoading] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      // status가 all일 때는 보내지 말고, 아닐 때만 보내는 것도 방법!
      const params = { page: currentPage, limit: itemsPerPage };
      if (search) params.q = search;
      if (filter !== "all") params.status = filter;

      const res = await getChallengeList(params);
      setChallenges(res.data.items); // 서버 구조에 따라 수정! (예: res.data.list)
      setTotalCount(res.data.total); // 마찬가지
    } catch (e) {
      setChallenges([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, [currentPage, search, filter]);
 

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFilter = (newFilter) => {
  setFilter(newFilter);
  setCurrentPage(1);
};

  const handleApply = (id) => {
    alert(`${id}번 챌린지 신청!`);
  };

    const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const totalPages = Math.ceil(totalCount / itemsPerPage);


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
        onFilter={handleFilter}
      />
      {loading ? (
        <div style={{ textAlign: "center", margin: "40px" }}>로딩 중...</div>
      ) : (
        <>
          <ChallengeList challenges={challenges} onApply={handleApply} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Challenge;