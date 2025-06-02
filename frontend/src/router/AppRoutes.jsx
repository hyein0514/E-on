import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Calendar from "../pages/Calendar/Calendar";
import Challenge from "../pages/Challenge/Challenge";
import Suggestion from "../pages/Suggestion/Suggestion";
import CommunityList from "../pages/Community/CommunityList";
import MyPage from "../pages/MyPage/MyPage";
import PrivateRoutes from "./PrivateRoutes";
import ChallengeCreate from "../pages/Challenge/ChallengeCreate";
import ChallengeDetail from "../pages/Challenge/ChallengeDetail";
import Attendance from "../pages/Challenge/Attendance";
import ReviewList from "../pages/Challenge/ReviewList";
import ReviewCreate from "../pages/Challenge/ReviewCreate";
import ChallengeEdit from "../pages/Challenge/ChallengeEdit";
import ReviewEdit from "../pages/Challenge/ReviewEdit";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/challenge/create" element={<ChallengeCreate />} />
            <Route path="/suggestion" element={<Suggestion />} />
            <Route path="/community" element={<CommunityList />} />
            <Route path="/attendance/:challengeId" element={<Attendance />} />
            <Route path="/challenge/:challengeId/reviews" element={<ReviewList />} />
            <Route path="/challenge/:challengeId/review/create" element={<ReviewCreate />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/challenge/:id/edit" element={<ChallengeEdit />} />
            <Route path="/challenge/:challengeId/review/:reviewId/edit" element={<ReviewEdit />} />
            {/*<Route
                path="/community"
                element={
                    <PrivateRoutes>
                        <CommunityList />
                    </PrivateRoutes>
                }
            />*/}
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