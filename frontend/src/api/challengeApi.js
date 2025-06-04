// src/api/challengeApi.js

import axios from "./axiosInstance";

// 1. 챌린지 생성
export const createChallenge = (data) => {
  return axios.post("/challenges", data);
};

// 2. 챌린지 목록 조회 (페이징 포함)
export const getChallengeList = (params) => {
  // params: { page, limit, ... }
  return axios.get("/challenges", { params });
};

// 3. 챌린지 상세 조회
export const getChallengeDetail = (challengeId) => {
  return axios.get(`/challenges/${challengeId}`);
};

// 4. 챌린지 수정
export const updateChallenge = (challengeId, data) => {
  return axios.patch(`/challenges/${challengeId}`, data);
};

// 5. 챌린지 삭제
export const deleteChallenge = (challengeId) => {
  return axios.delete(`/challenges/${challengeId}`);
};

// 6. 챌린지 상태변경
export const updateChallengeState = (challengeId, state) => {
  return axios.patch(`/challenges/${challengeId}/state`, { state });
};

// 7. 챌린지 참여 신청
export const participateChallenge = (challengeId, data) => {
  return axios.post(`/challenges/${challengeId}/participations`, data);
};

// 8. 챌린지 참여 취소
export const cancelParticipation = (participationId, data) => {
  return axios.patch(`/participations/${participationId}`, data);
};

// 8+. 챌린지 참여 조회
export const getParticipationDetail = (participationId) => {
  return axios.get(`/participations/${participationId}`);
};

// 9. 챌린지 출석 기록 조회
export const getChallengeAttendances = (challengeId, params) => {
  // params: { from, to }
  return axios.get(`/challenges/${challengeId}/attendance`, { params });
};

// 10. 출석 기록 추가
export const addAttendance = (participationId, data) => {
  return axios.post(`/participations/${participationId}/attendances`, data);
};

// 11. 출석 기록 수정
export const updateAttendance = (attendanceId, data) => {
  return axios.patch(`/attendances/${attendanceId}`, data);
};

// 12. 출석 기록 삭제
export const deleteAttendance = (attendanceId) => {
  return axios.delete(`/attendances/${attendanceId}`);
};

// 13. 챌린지 리뷰 작성
export const createReview = (challengeId, data) => {
  return axios.post(`/challenges/${challengeId}/reviews`, data);
};

// 14. 챌린지 리뷰 목록 조회
export const getChallengeReviews = (challengeId) => {
  return axios.get(`/challenges/${challengeId}/reviews`);
};

// 15. 리뷰 수정
export const updateReview = (reviewId, data) => {
  return axios.patch(`/reviews/${reviewId}`, data);
};

// 16. 리뷰 삭제
export const deleteReview = (reviewId) => {
  return axios.delete(`/reviews/${reviewId}`);
};

// 17. 챌린지 북마크 추가
export const addBookmark = (challengeId) => {
  return axios.post(`/challenges/${challengeId}/bookmarks`);
};

// 18. 북마크 해제
export const removeBookmark = (challengeId) => {
  return axios.delete(`/challenges/${challengeId}/bookmarks`);
};

// 19. 첨부파일 업로드 (multipart/form-data)
export const uploadAttachment = (challengeId, formData) => {
  return axios.post(`/challenges/${challengeId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 20. 첨부파일 목록 조회
export const getAttachments = (challengeId) => {
  return axios.get(`/challenges/${challengeId}/attachments`);
};

// 21. 첨부파일 삭제
export const deleteAttachment = (attachmentId) => {
  return axios.delete(`/attachments/${attachmentId}`);
};
