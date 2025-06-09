// src/pages/MyPage/NotificationPage.jsx
import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function NotificationPage() {
  const [settings, setSettings] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/api/notification')
      .then(res => {
        if (res.data.success) {
          setSettings(res.data.settings);
        }
      })
      .catch(() => {
        setMsg({ type: 'error', text: '알림 설정을 불러올 수 없습니다.' });
      });
  }, []);

  const toggle = idx => {
    const copy = [...settings];
    copy[idx].enabled = !copy[idx].enabled;
    setSettings(copy);
  };

  const handleSave = async () => {
    try {
      const res = await api.put('/api/notification', settings);
      if (res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
      }
    } catch {
      setMsg({ type: 'error', text: '저장에 실패했습니다.' });
    }
  };

  return (
    <div>
      <h3>알림 설정</h3>
      {msg.text && (
        <p style={{ color: msg.type === 'error' ? 'red' : 'green' }}>
          {msg.text}
        </p>
      )}
      <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '1rem' }}>
        <thead>
          <tr>
            <th>알림 유형</th>
            <th>받기</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((s, i) => (
            <tr key={s.type}>
              <td>{s.type}</td>
              <td>
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={() => toggle(i)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>저장</button>
    </div>
  );
}
