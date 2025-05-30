import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Calendar from "../pages/Calendar/Calendar";
import Challenge from "../pages/Challenge/Challenge";
import Suggestion from "../pages/Suggestion/Suggestion";
import CommunityList from "../pages/Community/CommunityList";
import MyPage from "../pages/MyPage/MyPage";
import PrivateRoutes from "./PrivateRoutes";
<<<<<<< HEAD
import ChallengeCreate from "../pages/Challenge/ChallengeCreate";
=======
>>>>>>> 40933ce (main 브랜치에서 frontend 폴더만 가져옴)

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/challenge" element={<Challenge />} />
<<<<<<< HEAD
            <Route path="/challenge/create" element={<ChallengeCreate />} />
            <Route path="/suggestion" element={<Suggestion />} />
            <Route path="/community" element={<CommunityList />} />
            {/*<Route
=======
            <Route path="/suggestion" element={<Suggestion />} />
            <Route
>>>>>>> 40933ce (main 브랜치에서 frontend 폴더만 가져옴)
                path="/community"
                element={
                    <PrivateRoutes>
                        <CommunityList />
                    </PrivateRoutes>
                }
<<<<<<< HEAD
            />*/}
=======
            />
>>>>>>> 40933ce (main 브랜치에서 frontend 폴더만 가져옴)
            <Route
                path="/mypage/:userId"
                element={
                    <PrivateRoutes>
                        <MyPage />
                    </PrivateRoutes>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
