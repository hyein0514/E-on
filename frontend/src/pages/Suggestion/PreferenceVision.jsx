// src/pages/Suggestion/PreferenceVision.jsx
import React, { useState, useEffect } from "react";
import styles from "./Preference.module.css";
import { getVisionCategories, getVisionsByCategory } from "../../api/preference";
import { useNavigate } from "react-router-dom";

const PreferenceVision = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
  const [visions, setVisions] = useState([]);
  const [selectedVisions, setSelectedVisions] = useState([]);

  useEffect(() => {
    getVisionCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (selectedCategoryCode) {
      getVisionsByCategory(selectedCategoryCode).then(setVisions);
    }
  }, [selectedCategoryCode]);

  const toggleVision = (vision) => {
    setSelectedVisions((prev) =>
      prev.includes(vision)
        ? prev.filter((item) => item !== vision)
        : [...prev, vision]
    );
  };

  const handleNext = () => {
    localStorage.setItem("selectedVisions", JSON.stringify(selectedVisions));
    navigate("/suggestion/recommendation");
  };

  return (
    <div className={styles.container}>
      <h2>진로 희망 선택</h2>

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
          {visions.map((vision) => (
            <button
              key={vision.vision_detail}
              className={`${styles.detailBtn} ${selectedVisions.includes(vision.vision_detail) ? styles.selected : ""}`}
              onClick={() => toggleVision(vision.vision_detail)}
            >
              {vision.vision_detail}
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

export default PreferenceVision;
