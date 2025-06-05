// src/api/challengeApi.js

import axiosInstance from "./axiosInstance";

// 1. 챌린지 생성
export const createChallenge = (data) => {
  return axiosInstance.post("/challenges", data);
};

// 2. 챌린지 목록 조회 (페이징 포함)
export const getChallengeList = (params) => {
  // params: { page, limit, ... }
  return axiosInstance.get("/challenges", { params });
};

// 3. 챌린지 상세 조회
export const getChallengeDetail = (challengeId, userId) => {
  return axiosInstance.get(`/challenges/${challengeId}`, { params: { user_id: userId } });
};

// 4. 챌린지 수정
export const updateChallenge = (challengeId, data) => {
  return axiosInstance.patch(`/challenges/${challengeId}`, data);
};

// 5. 챌린지 삭제
export const deleteChallenge = (challengeId) => {
  return axiosInstance.delete(`/challenges/${challengeId}`);
};

// 6. 챌린지 상태변경
export const updateChallengeState = (challengeId, state) => {
  return axiosInstance.patch(`/challenges/${challengeId}/state`, { state });
};

// 7. 챌린지 참여 신청
export const participateChallenge = (challengeId, data) => {
  return axiosInstance.post(`/challenges/${challengeId}/participations`, data);
};

// 8. 챌린지 참여 취소
export const cancelParticipation = (participationId, data) => {
  return axiosInstance.patch(`/participations/${participationId}`, data);
};

// 8+. 챌린지 참여 조회
export const getParticipationDetail = (participationId) => {
  return axiosInstance.get(`/participations/${participationId}`);
};

export const getParticipationDetailForUser = (challengeId, userId) => {
  // 만약 서버 라우터가 /api로 시작한다면 /api/challenge/...
  return axiosInstance.get(`/challenge/${challengeId}/user/${userId}`);
  // 만약 /api/challenge/...이 아니라면 그냥 /challenge/... 사용
};

// 9. 챌린지 출석 기록 조회
export const getChallengeAttendances = (challengeId, date) => {
  return axiosInstance.get(
    `/challenges/${challengeId}/attendance`,
    { params: { date } }   // ?date=YYYY-MM-DD
  );
};

// 10. 출석 기록 추가
export const addAttendance = (participationId, data) => {
  return axiosInstance.post(`/participations/${participationId}/attendances`, data);
};

// 11. 출석 기록 수정
export const updateAttendance = (attendanceId, data) => {
  return axiosInstance.patch(`/attendances/${attendanceId}`, data);
};

// 12. 출석 기록 삭제
export const deleteAttendance = (attendanceId) => {
  return axiosInstance.delete(`/attendances/${attendanceId}`);
};

// 13. 챌린지 리뷰 작성
export const createReview = (challengeId, data) => {
  return axiosInstance.post(`/challenges/${challengeId}/reviews`, data);
};

// 14. 챌린지 리뷰 목록 조회
export const getChallengeReviews = (challengeId) => {
  return axiosInstance.get(`/challenges/${challengeId}/reviews`);
};

// 15. 리뷰 수정
export const updateReview = (reviewId, data) => {
  return axiosInstance.patch(`/reviews/${reviewId}`, data);
};

// 16. 리뷰 삭제
export const deleteReview = (reviewId) => {
  return axiosInstance.delete(`/reviews/${reviewId}`);
};

// 17. 챌린지 북마크 추가
export const addBookmark = (challengeId, userId) => {
  return axiosInstance.post(`/challenges/${challengeId}/bookmarks`, { user_id: userId });
};

// 18. 북마크 해제
export const removeBookmark = (challengeId, userId) => {
  return axiosInstance.delete(`/challenges/${challengeId}/bookmarks`, { data: { user_id: userId } });
};

// 19. 첨부파일 업로드 (multipart/form-data)
export const uploadAttachment = (challengeId, formData) => {
  return axiosInstance.post(`/challenges/${challengeId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 20. 첨부파일 목록 조회
export const getAttachments = (challengeId) => {
  return axiosInstance.get(`/challenges/${challengeId}/attachments`);
};

// 21. 첨부파일 삭제
export const deleteAttachment = (attachmentId) => {
  return axiosInstance.delete(`/attachments/${attachmentId}`);
};
