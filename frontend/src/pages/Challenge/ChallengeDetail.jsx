import { useParams } from "react-router-dom";
import Header from "../../components/Common/Header";
import ChallengeDetailContent from "../../components/Challenge/ChallengeDetailContent";
import { useEffect, useState } from "react";
import { getChallengeDetail, getParticipationDetailForUser } from "../../api/challengeApi";

const ChallengeDetail = () => {
  const { id } = useParams();
  const userId = 1; // 임시
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [participationState, setParticipationState] = useState(null);

  // detail 정보와 참여상태를 모두 fetch하는 함수로 분리!
  const fetchDetail = async () => {
  setLoading(true);
  try {
    const res = await getChallengeDetail(id, userId);
    setChallenge(res.data);
    setBookmarked(!!res.data.is_bookmarked);

    try {
      // // 참여 기록 있으면 참여상태 설정
      // const participationRes = await getParticipationDetailForUser(id, userId);
      // setParticipationState(participationRes.data?.participating_state || null);
      // setIsJoined(['신청', '참여', 'APPROVED'].includes(participationRes.data?.participating_state));
      // setParticipationId(participationRes.data?.participating_id || null);
      // 변경된 방식: res.data.my_participation 안에 참여 정보가 들어 있습니다.
        const participationRes = await getParticipationDetailForUser(id, userId);
        const mp = participationRes.data?.my_participation || null;
        if (mp) {
          setParticipationState(mp.participating_state);
          setIsJoined(mp.participating_state !== "취소");
          setParticipationId(mp.participating_id);
        } else {
          setParticipationState(null);
          setIsJoined(false);
          setParticipationId(null);
        }
    } catch (e) {
      // 참여 기록이 없어서 404 뜨면 여기에 들어옴. 여기선 participation 값만 null!
      setParticipationState(null);
      setIsJoined(false);
      setParticipationId(null);
    }
  } catch (e) {
    // 정말로 챌린지 자체가 없는 경우만 여기서 setChallenge(null)!
    setChallenge(null);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchDetail();
  }, [id, userId]);

  if (loading) return (<div><Header /><div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div></div>);
  if (!challenge) return (<div><Header /><div style={{ padding: 40, textAlign: "center" }}>존재하지 않는 챌린지입니다.</div></div>);

  return (
    <div>
      <Header />
      <ChallengeDetailContent
        challenge={challenge}
        bookmarked={bookmarked}
        setBookmarked={setBookmarked}
        userId={userId}
        isJoined={isJoined}
        setIsJoined={setIsJoined}
        participationId={participationId}
        setParticipationId={setParticipationId}
        participationState={participationState}
        refresh={fetchDetail} // 추가! (핵심)
      />
    </div>
  );
};


export default ChallengeDetail;
