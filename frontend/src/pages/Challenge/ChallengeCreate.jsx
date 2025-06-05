// src/pages/Challenge/ChallengeCreate.jsx

import { createChallenge, uploadAttachment } from "../../api/challengeApi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import ChallengeCreateForm from "../../components/Challenge/ChallengeCreateForm";

const ChallengeCreate = () => {
  const navigate = useNavigate();

  /**
   * formData: ChallengeCreateForm 에서 넘겨주는 객체 (
   *   title, content, minimum_age, maximum_age, maximum_people, application_deadline, 
   *   start_date, end_date, is_recuming, repeat_type, intermediate_participation, 
   *   days, interestIds, visionIds, creator_contact, user_id 등
   * )
   * photoFile: <input type="file" accept="image/*" />에서 선택된 File 객체 (사진)
   * consentFile: <input type="file" accept=".pdf,.doc,.docx" />에서 선택된 File 객체 (보호자 동의서)
   */
  const handleSubmit = async (formData, photoFile, consentFile) => {
    try {
      // 1) 백엔드가 요구하는 필드 이름으로 재매핑
      const req = {
        title: formData.title,
        description: formData.content,
        minimum_age: formData.minAge,
        maximum_age: formData.maxAge,
        maximum_people: Number(formData.maximum_people),
        application_deadline: formData.deadline
          ? formData.deadline + "T23:59:59"
          : null,
        start_date: formData.startDate ? formData.startDate + "T07:00:00" : null,
        end_date: formData.endDate ? formData.endDate + "T07:30:00" : null,
        is_recuming: formData.isRegular === "정기",
        repeat_type:
          formData.isRegular === "정기"
            ? (() => {
                switch (formData.repeatCycle) {
                  case "주 1회":
                    return "WEEKLY";
                  case "격주":
                    return "BIWEEKLY";
                  case "월 1회":
                    return "MONTHLY";
                  default:
                    return "NONE";
                }
              })()
            : "NONE",
        intermediate_participation: formData.allowJoinMid === "허용",
        days: formData.days.map((day) => {
          switch (day) {
            case "월":
              return "Monday";
            case "화":
              return "Tuesday";
            case "수":
              return "Wednesday";
            case "목":
              return "Thursday";
            case "금":
              return "Friday";
            case "토":
              return "Saturday";
            case "일":
              return "Sunday";
            default:
              return day;
          }
        }),
        interestIds: formData.interestIds,
        visionIds: formData.visionIds,
        creator_contact: formData.phone,
        user_id: 1, // 실제 유저 정보로 교체 필요
      };

      // 2) 챌린지 생성 요청 (createChallenge)
      const res = await createChallenge(req);
      const challengeId = res.data.id;

      // 3) “사진” 업로드 (있다면)
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("file", photoFile);
        // 서버에서 type 필드를 받아서 DB에 “PHOTO”로 저장하도록 로직이 있어야 합니다.
        photoFormData.append("type", "PHOTO");
        await uploadAttachment(challengeId, photoFormData);
      }

      // 4) “보호자 동의서” 업로드 (있다면)
      if (consentFile) {
        const consentFormData = new FormData();
        consentFormData.append("file", consentFile);
        // 서버에서 type 필드를 받아서 DB에 “CONSENT”로 저장하도록 로직이 있어야 합니다.
        consentFormData.append("type", "CONSENT");
        await uploadAttachment(challengeId, consentFormData);
      }

      alert("챌린지 생성 완료!");
      navigate("/challenge"); // 생성 후 챌린지 목록 페이지로 이동
    } catch (err) {
      console.error("서버 에러 응답 전체:", error.response?.data);
      alert(err?.response?.data?.message || "챌린지 생성에 실패했습니다.");
    }
  };

  return (
    <div>
      <Header />
      {/*
        ChallengeCreateForm 컴포넌트가 onSubmit(formData, photoFile, consentFile)
        형태로 호출하도록 바뀌어야 합니다.
      */}
      <ChallengeCreateForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
};

export default ChallengeCreate;
