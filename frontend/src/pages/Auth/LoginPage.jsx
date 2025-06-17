import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <h2>로그인</h2>
      <LoginForm onSuccess={() => navigate('/')} />
      <div>
        <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
}
