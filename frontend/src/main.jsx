
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';

import SignupPage from './pages/Auth/SignupPage.jsx';
import LoginPage  from './pages/Auth/LoginPage.jsx';
import HomePage   from './pages/Home.jsx';    // 실제 메인 화면 컴포넌트
import NotFound   from './pages/NotFound.jsx';   // 404 페이지용 (선택)

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user
    ? children
    : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* 로그인된 사용자만 접근 가능한 루트 경로 */}
      <Route path="/" element={
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      }/>

      {/* 회원가입 및 로그인 페이지 */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login"  element={<LoginPage />} />

      {/* 그 외 경로는 404 또는 홈으로 리다이렉트 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}