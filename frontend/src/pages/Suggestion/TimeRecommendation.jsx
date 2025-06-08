import React, { useState } from "react";
import { fetchTimeRecommendations } from "../../api/timeRecommendation";
import TimeRecommendationCard from "../../components/Suggestion/TimeRecommendationCard";
import RecommendationModal from "../../components/Suggestion/RecommendationModal";
import styles from "./TimeRecommendation.module.css";
import { FaCalendarAlt } from "react-icons/fa";
import Header from "../../components/Common/Header";
import { Link } from "react-router-dom";

const TimeRecommendation = () => {
    const [schoolType, setSchoolType] = useState("elementary"); // 수정
    const [month, setMonth] = useState(1);

    const [recommendations, setRecommendations] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleFetch = async () => {
        try {
            const result = await fetchTimeRecommendations(schoolType, month);
            console.log("✅ 서버 응답 확인:", result);

            -setRecommendations(result);
        } catch (err) {
            console.error(err);
            alert("추천 정보를 불러오는 데 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>
                    <Link to="/recommendation/time" className={styles.navLink}>
                        <FaCalendarAlt /> 시기별 추천 활동
                    </Link>
                </h2>
                <h2 className={styles.title}>|</h2>
                <h2 className={styles.title}>
                    <Link
                        to="/suggestion/recommendation"
                        className={styles.navLink}>
                        🙌 개인별 추천 활동
                    </Link>
                </h2>
            </div>

            <div className={styles.selectRow}>
                <label>
                    학년:
                    <select
                        value={schoolType}
                        onChange={(e) => setSchoolType(e.target.value)}>
                        <option value="elementary">초등</option>
                        <option value="middle">중등</option>
                    </select>
                </label>

                <label>
                    월:
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}>
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
                        <TimeRecommendationCard
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
