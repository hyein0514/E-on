// src/pages/Suggestion/PreferenceVision.jsx
import React, { useState, useEffect } from "react";
import styles from "./Preference.module.css";
import {
  getVisionCategories,
  getVisionsByCategory
} from "../../api/preference";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

const PreferenceVision = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
  const [visions, setVisions] = useState([]);
  const [selectedVisions, setSelectedVisions] = useState([]);

  // ✅ 로그인 사용자 ID 불러오기
  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

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

  const handleNext = async () => {

     // ✅ 예외 처리 추가: 선택하지 않은 경우 경고창 표시
    if (selectedVisions.length === 0) {
      alert("진로 희망을 최소 1개 이상 선택해주세요.");
      return;
    }
    
    try {
      // ✅ 선택된 vision_detail 값을 vision_id로 매핑
      const visionIds = selectedVisions
        .map((detail) => {
          const match = visions.find((v) => v.vision_detail === detail);
          return match?.vision_id;
        })
        .filter(Boolean);

      // ✅ 백엔드에 POST
      await axios.post("/api/preferences/visions", {
        userId,
        visionIds
      });

      navigate("/suggestion/recommendation");
    } catch (err) {
      console.error("❌ 진로희망 저장 실패", err);
      alert("진로희망 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>진로 희망 선택</h2>

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
          {visions.map((vision) => (
            <button
              key={vision.vision_detail}
              className={`${styles.detailBtn} ${
                selectedVisions.includes(vision.vision_detail)
                  ? styles.selected
                  : ""
              }`}
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
