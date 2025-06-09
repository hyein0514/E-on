import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <h2>로그인</h2>
      <LoginForm onSuccess={() => navigate('/mypage')} />
    </div>
  );
}
