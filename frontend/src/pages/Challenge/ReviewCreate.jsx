import Header from "../../components/Common/Header";
import ReviewCreateForm from "../../components/Review/ReviewCreateForm";
import { useParams } from "react-router-dom";

const ReviewCreate = () => {
  const { challengeId } = useParams();

  return (
    <div>
      <Header />
      <ReviewCreateForm challengeId={challengeId} />
      {/* <== 박스 스타일, width 등은 오직 ReviewCreateForm에서만! */}
    </div>
  );
};

export default ReviewCreate;
