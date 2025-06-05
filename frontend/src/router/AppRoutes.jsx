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
import TimeRecommendation from "../pages/Suggestion/TimeRecommendation";
import PreferenceInterest from "../pages/Suggestion/PreferenceInterest";
import PreferenceVision from "../pages/Suggestion/PreferenceVision";
import RecommendationResult from "../pages/Suggestion/RecommendationResult";

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
            <Route path="/recommendation/time" element={<TimeRecommendation />} /> 
            <Route path="/suggestion/preferences" element={<PreferenceInterest />} />
            <Route path="/suggestion/preferences/vision" element={<PreferenceVision />} />
            <Route path="/suggestion/recommendation" element={<RecommendationResult />} />

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
