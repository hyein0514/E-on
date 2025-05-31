const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

//router.get('/', boardControllers.apfhweofawef); // 모든 게시판 조회 api (디자인 보고 보류)
// 게시판 전체 목록 조회
router.get('/', boardController.getBoardList);

// 게시판 상세 조회
router.get('/:board_id', boardController.getBoard);

// 게시글 목록 조회
router.get('/:board_id/posts', boardController.getBoardPost);

// 게시글 상세 조회
router.get('/posts/:post_id', boardController.getPost);

// 게시글 작성
router.post('/:board_id/posts', boardController.createPost);

// 게시글 수정
router.put('/posts/:post_id', boardController.updatePost);

// 게시글 삭제
router.delete('/posts/:post_id', boardController.deletePost);

// 댓글 작성
router.post('/posts/:post_id/comments', boardController.createComment);

// 댓글 수정
router.put('/comments/:comment_id', boardController.updateComment);

// 댓글 삭제
router.delete('/comments/:comment_id', boardController.deleteComment);

// 게시판 개설 신청
router.post('/board-requests', boardController.createBoardRequest);

// 게시판 개설 신청 목록 조회
router.get('/board-requests', boardController.getAllBoardRequests);

// 게시판 개설 승인

module.exports = router;