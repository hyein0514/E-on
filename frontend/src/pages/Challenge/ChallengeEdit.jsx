// pages/Challenge/ChallengeEdit.jsx

import ChallengeCreateForm from "../../components/Challenge/ChallengeCreateForm";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Common/Header";
import axios from "axios";

const ChallengeEdit = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);

  // 기존 데이터 받아오기
  useEffect(() => {
    axios.get(`/api/challenges/${id}`).then(res => setChallenge(res.data));
  }, [id]);

  if (!challenge) return <div>로딩중...</div>;

  return (
    <div>
      <Header />
      <h2 style={{ margin: "40px 0 28px 0", textAlign: "center" }}>챌린지 수정</h2>
      <ChallengeCreateForm mode="edit" initialData={challenge} />
    </div>
  );
};

export default ChallengeEdit;
