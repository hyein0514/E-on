// src/pages/MyPage/MyPage.jsx
import React from 'react';
import { NavLink, Routes, Route, Navigate, useParams } from 'react-router-dom';

import MyInfo            from './MyInfo';
import ChangePassword    from './ChangePassword';
import InterestPage      from './InterestPage';
import ActivityHistory   from './ActivityHistory';
import CalendarPage      from './CalendarPage';
import NotificationPage  from './NotificationPage';
import DeactivateAccount from './DeactivateAccount';
import AIRecHistory      from './AIRecHistory';
import DraftManager      from './DraftManager';
import NotFound          from './NotFound';

const MyPage = () => {
  const { userId } = useParams();

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 200, borderRight: '1px solid #ccc', padding: '1rem' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><NavLink to="info">내 정보 관리</NavLink></li>
            <li><NavLink to="password">비밀번호 변경</NavLink></li>
            <li><NavLink to="interest">관심 분야</NavLink></li>
            <li><NavLink to="history">활동 이력</NavLink></li>
            <li><NavLink to="calendar">내 일정 캘린더</NavLink></li>
            <li><NavLink to="notification">알림 설정</NavLink></li>
            <li><NavLink to="deactivate">탈퇴/비활성화</NavLink></li>
            <li><NavLink to="ai-history">AI 추천 기록</NavLink></li>
            <li><NavLink to="draft">임시 저장 글 관리</NavLink></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          {/* 기본 진입 시 info로 리디렉트 */}
          <Route index element={<Navigate to="info" replace />} />

          {/* 서브페이지들 */}
          <Route path="info"         element={<MyInfo />} />
          <Route path="password"     element={<ChangePassword />} />
          <Route path="interest"     element={<InterestPage />} />
          <Route path="history"      element={<ActivityHistory />} />
          <Route path="calendar"     element={<CalendarPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="deactivate"   element={<DeactivateAccount />} />
          <Route path="ai-history"   element={<AIRecHistory />} />
          <Route path="draft"        element={<DraftManager />} />

          {/* 없는 경로 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default MyPage;
