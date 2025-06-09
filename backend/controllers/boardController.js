const boardService = require("../services/boardService");
const { Post } = require('../models/Post');
const { Board } = require('../models/Board');
const { Comment } = require('../models/Comment');
const { BoardRequest } = require('../models/BoardRequest');
const User = require('../models/User');

exports.getBoardList = async (req, res) => {
  try {
    const boards = await Board.findAll({
      attributes: ['board_id', 'board_name'],
      order: [['board_id', 'ASC']]
    });
    res.status(200).json(boards);
  } catch (error) {
    console.error('게시판 목록 조회 실패:', error);
    res.status(500).json({ message: '게시판 목록 조회 실패' });
  }
};


exports.getBoard = async (req, res) => {
    try {
        const { board_id } = req.params;

        const board = await boardService.getBoardList(board_id);
        res.json(board);

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "게시판 조회 실패"});
    }
};

// 게시판의 게시글 목록 조회
exports.getBoardPost = async (req, res) => {
    try {
        const { board_id } = req.params;

        const boardPost = await boardService.getBoardPost(board_id);
        res.json(boardPost);

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "게시판 목록 조회 실패"});
    }    
};

exports.getPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const post = await boardService.getPostWithComments(post_id);

        if (!post) {
            return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "게시글 조회 실패" });
    }
};


// 게시글 작성
// 이거 서비스로 로직 분리해야하나 고민...
exports.createPost = async (req, res) => {
  const { board_id } = req.params;
  const { user_id, title, content } = req.body; // user_id는 로그인 기능이 생기면 JWT로 대체

  if (!user_id || !title || !content) {
    return res.status(400).json({ error: 'user_id, title, content는 필수입니다.' });
  }

  try {
    const newPost = await Post.create({
      board_id,
      user_id,
      title,
      content,
    });

    res.status(201).json({ message: '게시글 작성 성공', post: newPost });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 작성 중 오류가 발생했습니다.' });
  }
};


// 게시글 수정
// 이거 서비스로 로직 분리해야하나 고민...
exports.updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: '제목과 내용을 모두 입력해야 합니다.' });
  }

  try {
    const post = await Post.findOne({ where: { post_id } });

    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    await Post.update({ title, content }, { where: { post_id } });

    const updatedPost = await Post.findOne({ where: { post_id } });

    res.status(200).json({ message: '게시글 수정 성공', post: updatedPost });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 수정 중 오류가 발생했습니다.' });
  }
};


// 게시글 삭제
exports.deletePost = async (req, res) => {
  const { post_id } = req.params;

  try {
    const deletedCount = await Post.destroy({
      where: { post_id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    // 나중에 jwt 인증 추가되면 게시글 작성자와 삭제 요청자가 동일한지 확인하기
    // const post = await Post.findOne({ where: { post_id } });
    // if (post.user_id !== req.user.id) {
    //     return res.status(403).json({ error: '본인의 게시글만 삭제할 수 있습니다.' });
    //    }


    res.status(200).json({ message: '게시글 삭제 성공' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 삭제 중 오류가 발생했습니다.' });
  }
};


// 댓글 작성
exports.createComment = async (req, res) => {
  const { post_id } = req.params;
  const { user_id, content } = req.body; // user_id 부분을 JWT 인증? 어쨌든 로그인 기능 생기면 바꿔야함.

  if (!user_id || !content) {
    return res.status(400).json({ error: 'user_id와 content는 필수입니다.' });
  }

  try {
    const newComment = await Comment.create({
      post_id,
      user_id,
      content,
    });

    res.status(201).json({ message: '댓글 작성 성공', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 작성 중 오류가 발생했습니다.' });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { user_id, content } = req.body;  // 나중엔 req.user.id 사용 예정

  if (!content) {
    return res.status(400).json({ error: '수정할 댓글 내용이 필요합니다.' });
  }

  try {
    const comment = await Comment.findOne({ where: { comment_id } });

    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.user_id !== user_id) {
      return res.status(403).json({ error: '본인의 댓글만 수정할 수 있습니다.' });
    }

    await Comment.update(
      { content },
      { where: { comment_id } }
    );

    const updatedComment = await Comment.findOne({ where: { comment_id } });

    res.status(200).json({ message: '댓글 수정 성공', comment: updatedComment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 수정 중 오류가 발생했습니다.' });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const deletedCount = await Comment.destroy({
      where: { comment_id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    // 나중에 jwt 인증 추가되면 삭제 요청자가 해당 댓글의 작성자인지 확인하는 권한 체크하기
    //if (comment.user_id !== req.user.id) {
    //    return res.status(403).json({ error: '본인의 댓글만 삭제할 수 있습니다.' });
    //}

    res.status(200).json({ message: '댓글 삭제 성공' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 삭제 중 오류가 발생했습니다.' });
  }
};

// 게시판 개설 요청
exports.createBoardRequest = async (req, res) => {
    const { user_id, requested_board_name, requested_board_type, request_reason } = req.body;

    if (!user_id || !requested_board_name) {
        return res.status(400).json({ error: 'user_id와 requested_board_name은 필수입니다.'});
    }

    try {
        const newRequest = await BoardRequest.create({
            user_id,
            requested_board_name,
            requested_board_type,
            request_reason,
            request_date: new Date(),
            request_status: '대기',
        });
        res.status(201).json({
            message: '게시판 개설 신청이 접수되었습니다.',
            boardrequest: newRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시판 개설 신청 중 오류가 발생했습니다.' });
    }
};

// 게시판 개설 신청 목록 조회
exports.getAllBoardRequests = async (req, res) => {
    try {
        const requests = await BoardRequest.findAll({
            include: {
                model: User,
                attributes: ['user_id', 'name']
            },
            order: [['request_date', 'DESC']],
        });
        req.status(200).json({ requests });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: '게시판 신청 목록 조회 중 오류 발생'});
    }
};

// 게시판 개설 승인
// jwt 연동 시 관리자만 접근할 수 있게 수정
exports.updateBoardRequestStatus = async (req, res) => {
  const { request_id } = req.params;
  const { request_status } = req.body;

  try {
    const request = await BoardRequest.findOne({ where: { request_id } });

    if (!request) {
      return res.status(404).json({ error: '해당 신청 내역을 찾을 수 없습니다.' });
    }

    await BoardRequest.update(
      { request_status },
      { where: { request_id } }
    );

    // 게시판 개설 승인 시 board 테이블에 게시판 생성
    if (request_status == '승인') {
      const requested_board_name = request.requested_board_name;
      const requested_board_type = request.requested_board_type;
      await Board.create({
        board_name: requested_board_name,
        board_type: requested_board_type,
        created_at: new Date(),
      });
    }

    res.status(200).json({message: `게시판 신청이 '${request_status}' 처리되었습니다.`});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상태 변경 중 오류가 발생했습니다.' });
  }
};