// src/pages/Suggestion/PreferenceInterest.jsx
import React, { useState, useEffect } from "react";
import styles from "./Preference.module.css";
import {
  getInterestCategories,
  getInterestsByCategory
} from "../../api/preference";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

const PreferenceInterest = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // ✅ localStorage에서 로그인된 사용자 ID 가져오기
  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

  useEffect(() => {
    getInterestCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (selectedCategoryCode) {
      getInterestsByCategory(selectedCategoryCode).then(setInterests);
    }
  }, [selectedCategoryCode]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = async () => {
// ✅ 예외 처리 추가: 선택 항목이 없으면 경고 후 return
    if (selectedInterests.length === 0) {
      alert("관심 분야를 최소 1개 이상 선택해주세요.");
      return;
    }


    try {
      // ✅ 서버가 기대하는 건 interest_id 배열이므로 변환
      const interestIds = selectedInterests
        .map((detail) => {
          const match = interests.find((i) => i.interest_detail === detail);
          return match?.interest_id;
        })
        .filter(Boolean);

      await axios.post("/api/preferences/interests", {
        userId,
        interestIds
      });

      navigate("/suggestion/preferences/vision");
    } catch (err) {
      console.error("❌ 관심사 저장 실패", err);
      alert("관심사 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>관심 분야 선택</h2>

      <div className={styles.selectorRow}>
        <div className={styles.column}>
          {categories.map((cat) => (
            <button
              key={cat.category_code}
              className={`${styles.categoryBtn} ${
                cat.category_code === selectedCategoryCode ? styles.active : ""
              }`}
              onClick={() => setSelectedCategoryCode(cat.category_code)}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className={styles.column}>
          {interests.map((interest) => (
            <button
              key={interest.interest_detail}
              className={`${styles.detailBtn} ${
                selectedInterests.includes(interest.interest_detail)
                  ? styles.selected
                  : ""
              }`}
              onClick={() => toggleInterest(interest.interest_detail)}
            >
              {interest.interest_detail}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.submitBtn} onClick={handleNext}>
        선택 완료
      </button>
    </div>
  );
};

export default PreferenceInterest;
