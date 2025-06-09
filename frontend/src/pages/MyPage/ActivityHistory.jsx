// src/pages/MyPage/ActivityHistory.jsx
import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function ActivityHistory() {
  const [type, setType] = useState('all');
  const [period, setPeriod] = useState('3month');
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchHistory = () => {
    const params = { type, period };
    if (search.trim()) params.search = search.trim();

    api.get('/api/activity/history', { params })
      .then(res => {
        if (res.data.success) {
          setHistory(res.data.history);
          setMsg('');
        } else {
          setHistory([]);
          setMsg('이력 조회에 실패했습니다.');
        }
      })
      .catch(() => {
        setHistory([]);
        setMsg('서버 오류로 불러올 수 없습니다.');
      });
  };

  useEffect(fetchHistory, []);

  const handleFilter = e => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div>
      <h3>활동 이력 조회</h3>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      <form onSubmit={handleFilter} style={{ marginBottom: '1rem' }}>
        <label>
          유형:&nbsp;
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="all">전체</option>
            <option value="challenge">챌린지</option>
            <option value="extracurricular">비교과</option>
            <option value="book">도서</option>
            <option value="community">커뮤니티</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          기간:&nbsp;
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="1month">1개월</option>
            <option value="3month">3개월</option>
            <option value="6month">6개월</option>
            <option value="all">전체</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          검색:&nbsp;
          <input
            type="text"
            placeholder="검색어"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>

        <button type="submit" style={{ marginLeft: '1rem' }}>
          조회
        </button>
      </form>

      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>유형</th>
            <th>제목</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                이력이 없습니다.
              </td>
            </tr>
          ) : (
            history.map(item => (
              <tr key={item.history_id}>
                <td>{item.activity_type}</td>
                <td>{item.title}</td>
                <td>{new Date(item.date).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
