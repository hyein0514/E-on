import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
    const { user, loading, signup, login, logout, setUser } =
        useContext(AuthContext);
    return {
        user,
        loading,
        isLoggedIn: !!user && !loading,
        signup,
        login,
        logout,
        setUser,
    };
}
