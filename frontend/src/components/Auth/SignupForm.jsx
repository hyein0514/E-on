import { useState } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";

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
        console.log("🚀 signup 요청 시작됨");
        console.log(data);

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
        <div className="signup-form">
            {step === 1 && (
                <>
                    <h3>1단계: 회원유형 선택</h3>
                    <select
                        value={data.type}
                        onChange={(e) =>
                            setData({ ...data, type: e.target.value })
                        }>
                        // 학생,부모로만 받게 수정
                        <option value="student">학생</option>
                        <option value="parent">부모</option>
                    </select>
                    <button onClick={next1}>다음</button>
                </>
            )}

            {step === 2 && (
                <>
                    <h3>2단계: 약관 동의</h3>
                    {["terms", "privacy"].map((val) => (
                        <label key={val}>
                            <input
                                type="checkbox"
                                value={val}
                                checked={data.agreements.includes(val)}
                                onChange={() => {
                                    const arr = data.agreements.includes(val)
                                        ? data.agreements.filter(
                                              (x) => x !== val
                                          )
                                        : [...data.agreements, val];
                                    setData({ ...data, agreements: arr });
                                }}
                            />
                            {val === "terms"
                                ? "서비스 이용약관"
                                : "개인정보 수집약관"}
                        </label>
                    ))}
                    <button onClick={next2}>다음</button>
                </>
            )}

            {step === 3 && (
                <form onSubmit={finish}>
                    <h3>3단계: 이메일 인증 & 상세정보</h3>
                    {error && <p className="error">{error}</p>}
                    {msg && <p className="message">{msg}</p>}
                    <label>
                        이메일
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                            required
                        />
                        <button type="button" onClick={sendCode}>
                            인증번호 요청
                        </button>
                    </label>
                    <label>
                        인증번호
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) =>
                                setData({ ...data, code: e.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        이름
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        나이
                        <input
                            type="number"
                            value={data.age}
                            onChange={(e) =>
                                setData({ ...data, age: e.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        비밀번호
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                            required
                        />
                    </label>
                    <label>
                        비밀번호 확인
                        <input
                            type="password"
                            value={data.confirm}
                            onChange={(e) =>
                                setData({ ...data, confirm: e.target.value })
                            }
                            required
                        />
                    </label>
                    <button type="submit" onClick={finish}>
                        가입 완료
                    </button>
                </form>
            )}
        </div>
    );
}
