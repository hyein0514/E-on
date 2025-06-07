// src/api/communityApi.js
// 로그인 연동하면 Authorization 헤더 설정 필요할 수도ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ
import axiosInstance from "./axiosInstance";

// 게시판 리스트 조회
export const getBoardList = () => {
  return axiosInstance.get("/boards");
};

// 게시판 상세 조회
export const getBoard = (boardId) => {
  return axiosInstance.get(`/boards/${boardId}`);
};

// 게시글 목록 조회
export const getBoardPosts = (boardId) => {
  return axiosInstance.get(`/boards/${boardId}/posts`);
};

// 게시글 상세 조회
export const getPost = (postId) => {
  return axiosInstance.get(`/boards/posts/${postId}`);
};

// 게시글 작성
export const createPost = (boardId, postData) => {
  return axiosInstance.post(`/boards/${boardId}/posts`, postData);
};

// 게시글 수정
export const updatePost = (postId, postData) => {
  return axiosInstance.put(`/boards/posts/${postId}`, postData);
};

// 게시글 삭제
export const deletePost = (postId) => {
  return axiosInstance.delete(`/boards/posts/${postId}`);
};

// 댓글 작성
export const createComment = (postId, data) => {
  return axiosInstance.post(`/boards/posts/${postId}/comments`, data);
};

// 댓글 수정
export const updateComment = (commentId, data) => {
  return axiosInstance.put(`/boards/comments/${commentId}`, data);
};

// 댓글 삭제
export const deleteComment = (commentId) => {
  return axiosInstance.delete(`/boards/comments/${commentId}`);
};

// 게시판 개설 신청
export const createBoardRequest = (data) => {
  return axiosInstance.post(`/boards/board-requests`, data);
};

// 게시판 개설 신청 목록 조회
export const getAllBoardRequests = () => {
  return axiosInstance.get(`/boards/board-requests`);
};

// 게시판 개설 승인 (PATCH)
export const updateBoardRequestStatus = (requestId, status) => {
  return axiosInstance.patch(`/boards/board-requests/${requestId}`, { request_status: status });
};