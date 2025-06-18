// src/pages/MyPage/ChangePassword.jsx
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: '모든 필드를 입력해주세요.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    try {
      const res = await api.put('/api/user/me/password', {
        currentPassword,
        newPassword,
      });
      setMessage({ type: 'success', text: res.data.message || '비밀번호가 변경되었습니다.' });
      // 성공 시 메인 페이지로 이동하거나 입력 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // navigate('/mypage/info');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || '비밀번호 변경에 실패했습니다.',
      });
    }
  };

  return (
    <div>
      <h3>비밀번호 변경</h3>
      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">변경하기</button>
      </form>
    </div>
  );
}
