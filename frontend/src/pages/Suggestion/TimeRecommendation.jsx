import React, { useState } from 'react';
import { fetchTimeRecommendations } from '../../api/timeRecommendation';

const TimeRecommendation = () => {
    const [grade, setGrade] = useState(1);
    const [month, setMonth] = useState(1);
    const [recommendations, setRecommendations] = useState([]);

    const handleFetch = async () => {
    try {
        const result = await fetchTimeRecommendations(grade, month);
        setRecommendations(result);
    } catch (err) {
        console.error(err);
        alert('추천 정보를 불러오는 데 실패했습니다.');
    }
    };

    return (
    <div style={{ padding: '1rem' }}>
        <h2>시기별 추천 활동</h2>

        <label>학년:
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            {[...Array(6)].map((_, i) => (
            <option key={i} value={i + 1}>{`초${i + 1}`}</option>
            ))}
        </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>월:
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{`${i + 1}월`}</option>
            ))}
        </select>
        </label>

        <button style={{ marginLeft: '1rem' }} onClick={handleFetch}>
        추천 보기
        </button>

        <ul style={{ marginTop: '2rem' }}>
        {recommendations.length === 0 && <li>추천 활동이 없습니다.</li>}
        {recommendations.map((item) => (
            <li key={item.item_id}>
            <strong>{item.title}</strong><br />
            {item.description}
            </li>
        ))}
        </ul>
    </div>
    );
};

export default TimeRecommendation;
