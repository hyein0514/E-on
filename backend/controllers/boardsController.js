const boardService = require("../services/boardsService");
const { Post } = require('../models/Boards');

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
    const {post_id} = req.params;
    //const {name, content} = req.body; 조회에는 req.body 필요없음ㅠㅠ
    
    try {
        const post = await boardService.getPost(post_id);

        if (!post) {
            return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
        }

        res.json(post);
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "게시글 조회 실패"});
    }
};

// 게시글 작성성
// 이거 서비스로 로직 분리해야하나 고민...
exports.createPost = async (req, res) => {
    const { board_id } = req.params;
    const { name, title, content } = req.body; // name 부분을 user_id 이런 식으로 JWT 인증? 어쨌든 로그인 기능 생기면 바꿔야함.

    const newPost = await Post.create({
        board_id,
        name,
        title,
        content,
    });

    res.status(201).json({ message: '게시글 작성 성공', post: newPost });
}

// 게시글 수정
// 이거 서비스로 로직 분리해야하나 고민...
exports.updatePost = async (req, res) => {
    const { post_id } = req.params;
    const { board_id, name, title, content } = req.body;

    await Post.update({
        board_id,
        name,
        title,
        content,
    }, {
        where: { post_id: post_id},
    });

    const updatedPost = Post.findOne({ where: { post_id: post_id} });

    res.status(200).json({ message: '게시글 수정 성공', post: updatedPost});
}

// 게시글 삭제
// 이거 서비스로 로직 분리해야하나 고민...
// 에러 로직 빼고 일단 대충함.
exports.deletePost = async (req, res) => {
    const { post_id } = req.params;
    await Post.destroy({
        where: { post_id: post_id},
    });

    res.status(200).json({ message: '게시글 삭제 성공'});
}