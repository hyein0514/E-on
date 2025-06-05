import React, { useState } from "react";
import { fetchTimeRecommendations } from "../../api/timeRecommendation";
import RecommendationCard from "../../components/Suggestion/RecommendationCard";
import RecommendationModal from "../../components/Suggestion/RecommendationModal";
import styles from "./TimeRecommendation.module.css";
import { FaCalendarAlt } from "react-icons/fa";

const TimeRecommendation = () => {
    const [schoolType, setSchoolType] = useState("elementary"); // 수정
    const [month, setMonth] = useState(1);

    const [recommendations, setRecommendations] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

 const handleFetch = async () => {
  try {
    const result = await fetchTimeRecommendations(schoolType, month);
    console.log("✅ 서버 응답 확인:", result);

-   setRecommendations(result);
  } catch (err) {
    console.error(err);
    alert("추천 정보를 불러오는 데 실패했습니다.");
  }
};



  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          <FaCalendarAlt /> 시기별 추천 활동
        </h2>
      </div>

      <div className={styles.selectRow}>
        <label>
  학년:
  <select
    value={schoolType}
    onChange={(e) => setSchoolType(e.target.value)}
  >
    <option value="elementary">초등</option>
    <option value="middle">중등</option>
  </select>
</label>

        <label>
          월:
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleFetch}>추천 보기</button>
      </div>

      {recommendations.length === 0 ? (
        <div className={styles.emptyMessage}>
          😥 현재 선택한 조건에 해당하는 추천 활동이 없습니다.
        </div>
      ) : (
        <div className={styles.cardList}>
          {recommendations.map((item) => (
            <RecommendationCard
              key={item.item_id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      <RecommendationModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default TimeRecommendation;
