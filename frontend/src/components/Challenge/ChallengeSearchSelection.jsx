import ChallengeSearchBar from './ChallengeSearchBar';
import ChallengeFilterButton from './ChallengeFilterButton';
import ChallengeCreateButton from './ChallengeCreateButton';

const ChallengeSearchSection = ({
  search, setSearch, onSearch,
  onFilter, onCreate
}) => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "10px 0" }}>
      <div style={{ width: "90%", minWidth: "440px", margin: "10px auto" }}>
        {/* 검색창 (input+검색버튼) */}
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <ChallengeSearchBar
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
            />
          </div>
        </div>
        {/* 검색창 아래 버튼 2개를 flex로 좌우 정렬 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "9px"
        }}>
          {/* 왼쪽: 필터버튼 */}
          <div>
            <ChallengeFilterButton onClick={onFilter} />
          </div>
          {/* 오른쪽: 개설신청 버튼 */}
          <div>
            <ChallengeCreateButton onClick={onCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChallengeSearchSection;
