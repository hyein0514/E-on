import React from "react";
import styles from "./RecommendationCard.module.css";

const PersonalRecommendationCard = ({ challenge }) => {
  const {
    challenge_title,
    challenge_description,
    start_date,
    application_deadline,
    end_date,
    image_url
  } = challenge;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{challenge_title}</h3>
        <p>{challenge_description}</p>
      </div>
      <div className={styles.imageBox}>
        {image_url ? (
          <img src={image_url} alt="챌린지 이미지" />
        ) : (
          <div className={styles.noImage}>이미지 없음</div>
        )}
      </div>
      <div className={styles.cardFooter}>
        <p>시작일: {new Date(start_date).toLocaleDateString("ko-KR")}</p>
        <p>마감일: {new Date(application_deadline).toLocaleDateString("ko-KR")}</p>
        <p>종료일: {new Date(end_date).toLocaleDateString("ko-KR")}</p>
      </div>
    </div>
  );
};

export default PersonalRecommendationCard;
