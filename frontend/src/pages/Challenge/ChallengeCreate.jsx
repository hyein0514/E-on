import { createChallenge, uploadAttachment } from "../../api/challengeApi";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Common/Header';
import ChallengeCreateForm from "../../components/Challenge/ChallengeCreateForm";

const ChallengeCreate = () => {
  const navigate = useNavigate();

  // 실제로 등록 버튼 눌렀을 때 실행될 함수
  const handleSubmit = async (formData, file) => {

    // formData.maximum_people 값을 콘솔로 확인
  console.log("폼에서 보내는 값 maximum_people:", formData.maximum_people);
  // 또는, 전체 formData 확인
  console.log("최종 서버 전송 데이터(formData):", formData);

    try {
      // (1) 폼 데이터 → 백엔드 요구 형태로 변환
      const req = {
        title: formData.title,
        description: formData.content, // content -> description
        minimum_age: formData.minAge,
        maximum_age: formData.maxAge,
        maximum_people:  Number(formData.maximum_people),
        application_deadline: formData.deadline
          ? formData.deadline + "T23:59:59"
          : null,
        start_date: formData.startDate
          ? formData.startDate + "T07:00:00"
          : null,
        end_date: formData.endDate
          ? formData.endDate + "T07:30:00"
          : null,
        is_recuming: formData.isRegular === "정기",
        repeat_type: formData.isRegular === "정기"
          ? (() => {
              switch (formData.repeatCycle) {
                case "주 1회": return "WEEKLY";
                case "격주": return "BIWEEKLY";
                case "월 1회": return "MONTHLY";
                default: return "NONE";
              }
            })()
          : "NONE",
        intermediate_participation: formData.allowJoinMid === "허용",
        days: formData.days.map(day => {
          // 한글 요일 -> 영어 변환 (예시)
          switch (day) {
            case "월": return "Monday";
            case "화": return "Tuesday";
            case "수": return "Wednesday";
            case "목": return "Thursday";
            case "금": return "Friday";
            case "토": return "Saturday";
            case "일": return "Sunday";
            default: return day;
          }
        }),
        interestIds: formData.interestIds, // 키워드/관심사: 키워드 id를 받아야 할 수도. (추후 수정)
        visionIds: formData.visionIds,       // 미션/비전 id
        creator_contact: formData.phone,
        user_id: 1 // (실제 유저 정보로 교체 필요)
      };

      // (2) 챌린지 등록 요청
      const res = await createChallenge(req);

      // (3) 첨부파일 있으면 업로드
      if (file) {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        await uploadAttachment(res.data.id, formDataObj);
      }

      alert("챌린지 생성 완료!");
      navigate("/challenge"); // 생성 후 목록 등으로 이동
    } catch (err) {
      alert(
        err?.response?.data?.message || "챌린지 생성에 실패했습니다."
      );
    }
  };

  return (
    <div>
      <Header />
      <ChallengeCreateForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
};

export default ChallengeCreate;



