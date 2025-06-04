import ChallengeListItem from "./ChallengeListItem";

const ChallengeList = ({ challenges, onApply }) => {
  if (challenges.length === 0) {
    return (
      <div style={{ color: "#999", padding: "32px", textAlign: "center", width: "90%", minWidth: "440px", margin: "0 auto" }}>
        검색 결과가 없습니다.
      </div>
    );
  }
  return (
    <div style={{ width: "90%", minWidth: "440px", margin: "0 auto" }}>
      {challenges.map(challenge => (
        <ChallengeListItem
          key={challenge.challenge_id}
          {...challenge}
          onApply={() => onApply(challenge.challenge_id)}
        />
      ))}
    </div>
  );
};

export default ChallengeList;

