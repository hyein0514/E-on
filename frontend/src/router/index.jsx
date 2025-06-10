import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Common/Header';
import HomePage from '../pages/HomePage';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import MyPage from '../pages/MyPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

export default function AppRouter() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/mypage/*"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
