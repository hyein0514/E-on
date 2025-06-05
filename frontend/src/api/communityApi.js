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
