import { useParams } from "react-router-dom";
import Header from "../../components/Common/Header";
import ChallengeDetailContent from "../../components/Challenge/ChallengeDetailContent";

// 임시 더미데이터 (실제로는 API로 받아오기)
const dummyData = [
  {
    id: 1,
    status: "모집중",
    title: "리액트 완전정복 챌린지",
    content: "리액트를 완벽하게 마스터하는 챌린지입니다.",
    startDate: "2025-04-06",
    endDate: "2025-07-06",
    deadline: "2025-03-31",
    imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b", // (샘플 이미지 URL)
    isRegular: "정기",
    repeatCycle: "주 1회",
    days: ["월", "수"],
    allowJoinMid: "허용",
    field: "교과",
    keywords: ["과학", "탐구"],
    limit: 20,
    minAge: 14,
    maxAge: 16,
    userName: "홍길동",
    email: "school@gmail.com",
    phone: "010-1234-5670",
    place: "가나중학교"
  },
  {
    id: 2,
    status: "마감",
    title: "알고리즘 마스터",
    content: "코딩 실력을 키우는 최고의 알고리즘 챌린지!",
    startDate: "2025-01-10",
    endDate: "2025-03-10",
    deadline: "2024-12-30",
    imageUrl: "", // 이미지 없으면 빈 문자열 or undefined
    isRegular: "비정기",
    repeatCycle: "",
    days: [],
    allowJoinMid: "비허용",
    field: "진로",
    keywords: ["코딩", "경시"],
    limit: 10,
    minAge: 12,
    maxAge: 16,
    userName: "최유저",
    email: "user2@email.com",
    phone: "010-2345-6789",
    place: "초록고등학교"
  }
];


const ChallengeDetail = () => {
  const { id } = useParams();
  const challenge = dummyData.find(item => String(item.id) === String(id));

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