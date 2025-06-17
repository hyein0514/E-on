import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function LoginForm({ onSuccess }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login({email, password});
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        이메일
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        비밀번호
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">로그인</button>
    </form>
  );
}
