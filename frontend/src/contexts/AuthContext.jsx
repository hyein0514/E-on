import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // axios 기본 설정: 쿠키 전송
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const signup = async ({ name, email, age, code, password, confirm }) => {
    const res = await axios.post('/auth/join/step3', {
      name, email, age, code, password, confirm
    });
    setUser(res.data.user);
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await axios.post('/auth/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
