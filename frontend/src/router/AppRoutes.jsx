// src/router/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home                 from '../pages/Home';
import Login                from '../pages/Auth/Login';
import Calendar             from '../pages/Calendar/Calendar';
import Challenge            from '../pages/Challenge/Challenge';
import Suggestion           from '../pages/Suggestion/Suggestion';
import CommunityList        from '../pages/Community/CommunityList';
import CommunityWrite       from '../pages/Community/CommunityWrite';
import CommunityEdit        from '../pages/Community/CommunityEdit';
import BoardRequestPage     from '../pages/Community/BoardRequestPage';
import PostDetail           from '../pages/Community/PostDetail';
import ChallengeCreate      from '../pages/Challenge/ChallengeCreate';
import ChallengeDetail      from '../pages/Challenge/ChallengeDetail';
import Attendance           from '../pages/Challenge/Attendance';
import ReviewList           from '../pages/Challenge/ReviewList';
import ReviewCreate         from '../pages/Challenge/ReviewCreate';
import ChallengeEdit        from '../pages/Challenge/ChallengeEdit';
import ReviewEdit           from '../pages/Challenge/ReviewEdit';
import TimeRecommendation   from '../pages/Suggestion/TimeRecommendation';
import PreferenceInterest   from '../pages/Suggestion/PreferenceInterest';
import PreferenceVision     from '../pages/Suggestion/PreferenceVision';
import RecommendationResult from '../pages/Suggestion/RecommendationResult';

import MyPage       from '../pages/MyPage/MyPage';
import PrivateRoutes from './PrivateRoutes';
import NotFound      from '../pages/NotFound';
import Signup from '../pages/Auth/Signup';

const AppRoutes = () => (
  <Routes>
    {/* 기본 리디렉션 */}
    <Route path="/" element={<Navigate to="/calendar" replace />} />

    {/* 공개 페이지 */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/calendar" element={<Calendar />} />
    <Route path="/challenge" element={<Challenge />} />
    <Route path="/challenge/create" element={<ChallengeCreate />} />
    <Route path="/challenge/:id" element={<ChallengeDetail />} />
    <Route path="/challenge/:id/edit" element={<ChallengeEdit />} />
    <Route path="/challenge/:challengeId/reviews" element={<ReviewList />} />
    <Route path="/challenge/:challengeId/review/create" element={<ReviewCreate />} />
    <Route path="/challenge/:challengeId/review/:reviewId/edit" element={<ReviewEdit />} />
    <Route path="/attendance/:challengeId" element={<Attendance />} />

    {/* 추천 관련 */}
    <Route path="/recommendation/time" element={<TimeRecommendation />} />
    <Route path="/suggestion" element={<Suggestion />} />
    <Route path="/suggestion/preferences" element={<PreferenceInterest />} />
    <Route path="/suggestion/preferences/vision" element={<PreferenceVision />} />
    <Route path="/suggestion/recommendation" element={<RecommendationResult />} />

    {/* 커뮤니티 */}
    <Route path="/community" element={<CommunityList />} />
    <Route path="/community/:board_id/write" element={<CommunityWrite />} />
    <Route path="/posts/:post_id" element={<PostDetail />} />
    <Route path="/community/board-requests" element={<BoardRequestPage />} />

    {/* ───────────────────────────── */}
    {/* 마이페이지: 중첩 라우트 */}
    <Route
      path="/mypage/:userId/*"
      element={
        <PrivateRoutes>
          <MyPage />
        </PrivateRoutes>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
