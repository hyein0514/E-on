import React, { useEffect, useState } from "react";
import { fetchRecommendationsByPreference } from "../../api/preference";
import RecommendationCard from "../../components/Suggestion/RecommendationCard";
import styles from "./RecommendationResult.module.css";

const RecommendationResult = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("❌ userId가 localStorage에 없습니다.");
      return;
    }

    fetchRecommendationsByPreference(userId)
      .then((data) => setRecommendations(data))
      .catch((err) => console.error("추천 로딩 실패:", err));
  }, []);

  return (
    <div className={styles.container}>
      <h2>추천 챌린지</h2>
      {recommendations.length === 0 ? (
  <p>추천된 챌린지가 없습니다.</p>
) : (
  recommendations.map((item) =>
    item ? (
      <RecommendationCard key={item.challenge_id} challenge={item} />
    ) : null
  )
)}
    </div>
  );
};

export default RecommendationResult;
