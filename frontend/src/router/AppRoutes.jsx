import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Calendar from "../pages/Calendar/Calendar";
import Challenge from "../pages/Challenge/Challenge";
import MyPage from "../pages/MyPage/MyPage";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = () =>{
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/mypage/:username" element={<PrivateRoutes><MyPage /></PrivateRoutes>} />
        </Routes>
    );
}

export default AppRoutes;