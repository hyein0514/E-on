import React, { useEffect, useState } from "react";
import { fetchRecommendationsByPreference } from "../../api/preference";
import PersonalRecommendationCard from "../../components/Suggestion/PersonalRecommendationCard";
import styles from "./RecommendationResult.module.css";
import { FaCalendarAlt } from "react-icons/fa";
import Header from "../../components/Common/Header";
import { Link } from "react-router-dom";

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
            <h2>추천 챌린지</h2>
            {recommendations.length === 0 ? (
                <p>추천된 챌린지가 없습니다.</p>
            ) : (
                <div className={styles.cardList}>
                    {recommendations.map((item) =>
                        item ? (
                            <PersonalRecommendationCard
                                key={item.challenge_id}
                                challenge={item}
                            />
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
};

export default RecommendationResult;
