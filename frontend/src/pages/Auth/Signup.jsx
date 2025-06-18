import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/Auth/SignupForm';

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <h2>회원가입</h2>
      <SignupForm onFinish={() => navigate('/login')} />
    </div>
  );
}
