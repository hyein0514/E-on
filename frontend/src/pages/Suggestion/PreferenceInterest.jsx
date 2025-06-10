// src/pages/Suggestion/PreferenceInterest.jsx
import React, { useState, useEffect } from "react";
import styles from "./Preference.module.css";
import { getInterestCategories, getInterestsByCategory } from "../../api/preference";
import { useNavigate } from "react-router-dom";

const PreferenceInterest = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

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

  const handleNext = () => {
    localStorage.setItem("selectedInterests", JSON.stringify(selectedInterests));
    navigate("/suggestion/preferences/vision");
  };

  return (
    <div className={styles.container}>
      <h2>관심 분야 선택</h2>

      <div className={styles.selectorRow}>
        <div className={styles.column}>
          {categories.map((cat) => (
            <button
              key={cat.category_code}
              className={`${styles.categoryBtn} ${cat.category_code === selectedCategoryCode ? styles.active : ""}`}
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
              className={`${styles.detailBtn} ${selectedInterests.includes(interest.interest_detail) ? styles.selected : ""}`}
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
