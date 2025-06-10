import { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import ChallengeSearchSection from "../../components/Challenge/ChallengeSearchSelection";
import ChallengeList from "../../components/Challenge/ChallengeList";
import Pagination from "../../components/Challenge/Pagination";
import { getChallengeList, participateChallenge, cancelParticipation } from "../../api/challengeApi";
import axiosInstance from "../../api/axiosInstance";
import styles from "../../styles/Pages/Challenge.module.css"

const itemsPerPage = 5;

const Challenge = () => {
  const [search, setSearch] = useState("");             // 검색어
  const [currentPage, setCurrentPage] = useState(1);    // 페이지
  const [challenges, setChallenges] = useState([]);     // API 응답 배열
  const [totalCount, setTotalCount] = useState(0);      // 총 아이템 수
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const userId = 1; // 로그인 유저 ID (예시)

  // ─── 필터 상태: 모달에서 내려오는 값들을 담음 ───
  const emptyFilters = {
    status: [],
    date: "",
    minAge: "",
    maxAge: "",
    interestId: "",
    visionId: ""
  };

  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  // 관심사/비전 옵션을 미리 받아오기
  const [interestOptions, setInterestOptions] = useState([]);
  const [visionOptions, setVisionOptions]     = useState([]);

  // “필터 해제” 버튼 클릭 시 호출
  const handleClearFilters = () => {
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    axiosInstance.get("/api/interests")
      .then((res) => setInterestOptions(res.data))
      .catch((err) => console.error("관심사 조회 실패:", err));

    axiosInstance.get("/api/visions")
      .then((res) => setVisionOptions(res.data))
      .catch((err) => console.error("비전 조회 실패:", err));
  }, []);

  // ─── 챌린지 목록 조회 함수 ───
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        user_id: userId
      };

      if (search) {
        params.q = search;
      }

      // ★ appliedFilters가 항상 객체이므로 undefined가 될 일이 없도록 초기값을 위에서 설정
      const { status, date, minAge, maxAge, interestId, visionId } = appliedFilters;

      // 1) 상태 필터 (배열 status에서 첫 번째 값만 BACKEND에 넘김)
      if (Array.isArray(status) && status.length > 0) {
        const mapped = status
          .map((s) => {
            if (s === "진행중") return "ACTIVE";
            if (s === "완료")   return "CLOSED";
            if (s === "취소됨") return "CANCELLED";
            return null;
          })
          .filter(Boolean);
        if (mapped.length > 0) {
          params.state = mapped[0];
        }
      }

      // 2) 날짜 필터
      if (date) {
        params.date = date; // "YYYY-MM-DD"
      }

      console.log("▶ fetchChallenges 에서 보낼 params:", { minAge, maxAge, ...params });

      // 3) 나이 필터
      if (minAge) params.minAge = minAge;
      if (maxAge) params.maxAge = maxAge;

      // 4) 관심사 ID 필터
      if (interestId) {
        params.interestId = Number(interestId);
      }

      // 5) 비전 ID 필터
      if (visionId) {
        params.visionId = Number(visionId);
      }

      const res = await getChallengeList(params);
      setChallenges(res.data.challenges);
      setTotalCount(res.data.totalItems);
    } catch (err) {
      console.error("챌린지 조회 중 오류:", err);
      setChallenges([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  // 검색어, 페이지, appliedFilters 바뀔 때마다 호출
  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, currentPage, appliedFilters]);

  // 검색 버튼 눌렀을 때
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // "필터 적용" 콜백: ChallengeSearchSection → handleApplyFilter 실행
  const handleApplyFilter = (filtersFromModal) => {
    // filtersFromModal: { status, date, minAge, maxAge, interestId, visionId }
    setAppliedFilters(filtersFromModal);
    setCurrentPage(1);
  };

  // 챌린지 생성 페이지로 이동 (예시)
  const handleCreate = () => {
    // 예: navigate("/challenge/create");
  };

  // 참여 / 참여 취소 로직
  const handleApply = async ({ challenge_id, isJoined, participationId, participationState }) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      if (isJoined) {
        if (!participationId) {
          alert("참여 기록이 없습니다.");
          setActionLoading(false);
          return;
        }
        await cancelParticipation(participationId);
        alert("참여가 취소되었습니다.");
      } else {
        if (participationId && participationState === "취소") {
          await cancelParticipation(participationId);
          await new Promise((res) => setTimeout(res, 200));
          await participateChallenge(challenge_id, { user_id: userId });
          alert("참여가 완료되었습니다!");
        } else {
          await participateChallenge(challenge_id, { user_id: userId });
          alert("참여가 완료되었습니다!");
        }
      }
      await fetchChallenges();
    } catch (error) {
      alert("참여 처리 중 오류가 발생했습니다.");
      console.error(error);
    }
    setActionLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className={styles.container} style={{ width: "100%", display: "flex", justifyContent: "center", margin: "10px 0" }}>
      <div style={{ width: "90%", minWidth: "440px", margin: "10px auto" }}>
        <div className={styles.header} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0',paddingLeft: '150px' }}>
          <Header />
        </div>

        {/* 검색/필터/생성 섹션 */}
        <ChallengeSearchSection
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
          onCreate={handleCreate}
          onClearFilters={handleClearFilters} 
          // 모달에 내려줄 옵션 및 콜백
          interestList={interestOptions}
          visionList={visionOptions}
          onFilter={handleApplyFilter}
        />

        {/* 챌린지 리스트 or 로딩 메시지 */}
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
    </div>
  );
};

export default Challenge;