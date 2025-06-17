import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/Auth/LoginForm.module.css";

export default function LoginForm({ onSuccess }) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login({ email, password });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "로그인 실패 😢");
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            {error && <p className={styles.errorMessage}>{error}</p>}

            <div className={styles.inputGroup}>
                <label>이메일</label>
                <input
                    type="email"
                    placeholder="이메일을 입력해주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label>비밀번호</label>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {/* <div className={styles.checkboxGroup}>
                <label>
                    <input type="checkbox" />
                    자동로그인
                </label>
            </div> */}

            <button type="submit" className={styles.loginButton}>
                로그인
            </button>
        </form>
    );
}

// import { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';

// export default function LoginForm({ onSuccess }) {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setError('');
//     try {
//       await login({email, password});
//       onSuccess();
//     } catch (err) {
//       setError(err.response?.data?.message || '로그인 실패');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <p className="error">{error}</p>}
//       <label>
//         이메일
//         <input
//           type="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//         />
//       </label>
//       <label>
//         비밀번호
//         <input
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//         />
//       </label>
//       <button type="submit">로그인</button>
//     </form>
//   );
// }
