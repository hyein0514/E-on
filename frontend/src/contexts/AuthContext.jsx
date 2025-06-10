// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 1) 마운트 시 세션 확인
  useEffect(() => {
    api.get('/api/user/me')
      .then(res => {
        if (res.data.success) setUser(res.data.user);
      })
      .catch(() => setUser(null));
  }, []);

  // 2) 이메일/비밀번호 로그인
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    return res;
  };

  // 3) 로그아웃
  const logout = async () => {
    await api.get('/auth/logout');
    setUser(null);
  };

  // 4) 최종 회원가입 (step3)
  const signup = data => api.post('/auth/join/step3', data);

  // 5) 로그인 여부
  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
