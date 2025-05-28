const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardsController');

//router.get('/', boardControllers.apfhweofawef); // 모든 게시판 조회 api (디자인 보고 보류)
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

module.exports = router;