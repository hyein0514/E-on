import { useState } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/Auth/SignupForm.module.css";

export default function SignupForm({ onFinish }) {
    const { signup } = useAuth();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        type: "student",
        agreements: [],
        email: "",
        code: "",
        name: "",
        age: "",
        password: "",
        confirm: "",
    });
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const next1 = async () => {
        await api.post("/auth/join/step1", { userType: data.type });
        setStep(2);
    };

    const next2 = async () => {
        if (data.agreements.length < 2) {
            setError("필수 약관에 동의해주세요.");
            return;
        }
        await api.post("/auth/join/step2", { agreements: data.agreements });
        setStep(3);
    };

    const sendCode = async () => {
        await api.post("/auth/join/email", { email: data.email });
        setMsg("인증번호가 발송되었습니다.");
    };

    const finish = async (e) => {
        e.preventDefault();
        if (data.password !== data.confirm) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await signup({
                name: data.name,
                email: data.email,
                type: data.type,
                age: data.age,
                code: data.code,
                password: data.password,
                confirm: data.confirm,
                agreements: data.agreements,
            });
            setMsg("회원가입 완료!");
            onFinish();
        } catch (err) {
            setError(err.response?.data?.message || "회원가입 실패");
        }
    };

    return (
        <div className={styles.signupForm}>
            <div className={styles.steps}>
                {[1, 2, 3, 4].map((n) => (
                    <div
                        key={n}
                        className={`${styles.step} ${step === n ? styles.active : ""}`}
                    >
                        {n}
                    </div>
                ))}
            </div>

            <hr className={styles.divider} />

            {step === 1 && (
                <>
                    <h3 className={styles.title}>E-ON 회원가입</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>회원 유형</label>
                        <select
                            className={styles.input}
                            value={data.type}
                            onChange={(e) => setData({ ...data, type: e.target.value })}
                        >
                            <option value="student">학생</option>
                            <option value="parent">부모</option>
                        </select>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.submitButton} onClick={next1}>
                            다음
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h3 className={styles.title}>E-ON 회원가입</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>약관 동의</label>
                        {["terms", "privacy"].map((val) => (
                            <label key={val} className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    value={val}
                                    checked={data.agreements.includes(val)}
                                    onChange={() => {
                                        const arr = data.agreements.includes(val)
                                            ? data.agreements.filter((x) => x !== val)
                                            : [...data.agreements, val];
                                        setData({ ...data, agreements: arr });
                                    }}
                                />
                                {val === "terms"
                                    ? "서비스 이용약관 동의 (필수)"
                                    : "개인정보 수집 및 이용 동의 (필수)"}
                            </label>
                        ))}
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.submitButton} onClick={next2}>
                            동의
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <form onSubmit={finish}>
                    <h3 className={styles.title}>E-ON 회원가입</h3>
                    {error && <p className={styles.error}>{error}</p>}
                    {msg && <p className={styles.message}>{msg}</p>}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>이메일</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="email"
                                className={styles.input}
                                value={data.email}
                                onChange={(e) =>
                                    setData({ ...data, email: e.target.value })
                                }
                                required
                            />
                            <button
                                type="button"
                                className={styles.inlineBtn}
                                onClick={sendCode}
                            >
                                인증요청
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>인증번호 입력</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={data.code}
                            onChange={(e) =>
                                setData({ ...data, code: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>이름</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={data.name}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>나이</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={data.age}
                            onChange={(e) =>
                                setData({ ...data, age: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>비밀번호 확인</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={data.confirm}
                            onChange={(e) =>
                                setData({ ...data, confirm: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>
                            가입하기
                        </button>
                    </div>
                </form>
            )}

            {step === 4 && (
                <div>
                    <h3 className={styles.title}>E-ON 회원가입</h3>
                    <p className={styles.completeText}>가입이 완료되었습니다. 환영합니다!</p>
                    <div className={styles.buttonGroup}>
                        <button className={styles.submitButton}>로그인하러 가기</button>
                    </div>
                </div>
            )}
        </div>
    );
}
