import { createContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

// 마이페이지 리다이렉션 문제 해결
// AuthContext에서 user === undefined 상태랑 loading을 구분해서 제공
function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); //
    const [loading, setLoading] = useState(true);

    const signup = async ({
        name,
        email,
        age,
        code,
        password,
        confirm,
        type,
        agreements,
    }) => {
        try {
            console.log("📦 signup axios 요청 보냄");
            const res = await api.post("/auth/join/step3", {
                name,
                email,
                age,
                code,
                password,
                confirm,
                type,
                agreements,
            });
            console.log("✅ signup axios 성공", res.data);
            setUser(res.data.user);

            // ✅ localStorage 저장
            localStorage.setItem("user", JSON.stringify(res.data.user));

            return res.data;
        } catch (err) {
            console.error("❌ signup axios 에러", err);
            throw err;
        }
    };

    const login = async ({ email, password }) => {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data.user);

        // ✅ localStorage에 저장
        localStorage.setItem("user", JSON.stringify(res.data.user));


        return res.data;
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);

        // ✅ localStorage 제거
        localStorage.removeItem("user");
    };

    // useEffect → 변경 필요
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await api.get("/api/user/me"); // ✅ 변경된 경로
                setUser(res.data.user);

                // ✅ localStorage에 저장
                localStorage.setItem("user", JSON.stringify(res.data.user));
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
