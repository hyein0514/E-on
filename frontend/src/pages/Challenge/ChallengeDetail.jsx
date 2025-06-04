import { useParams } from "react-router-dom";
import Header from "../../components/Common/Header";
import ChallengeDetailContent from "../../components/Challenge/ChallengeDetailContent";
import { useEffect, useState } from "react";
import { getChallengeDetail } from "../../api/challengeApi";

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getChallengeDetail(id);
        setChallenge(res.data);
      } catch (e) {
        setChallenge(null);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div>
      <Header />
      <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>
    </div>
  );

  if (!challenge) return (
    <div>
      <Header />
      <div style={{ padding: 40, textAlign: "center" }}>존재하지 않는 챌린지입니다.</div>
    </div>
  );

  return (
    <div>
      <Header />
      <ChallengeDetailContent challenge={challenge} />
    </div>
  );
};

export default ChallengeDetail;
