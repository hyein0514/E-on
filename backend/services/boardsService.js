const { Board, Post } = require('../models/Boards');
const { User } = require('../models/User'); 
const { Se } = require('sequelize');
const axios = require("axios");

// 게시판 상세 조회
async function getBoardList(board_id) {
    try {
        const boards = await Board.findAll({
            where: { board_id },
        });

        return boards;
    } catch (error) {
        console.error("게시판 조회 실패:", error.message);
        throw error;
    }
};

// 게시글 목록 조회
async function getBoardPost(board_id) {
    try {
        const boardPosts = await Post.findAll({
            attributes: [ 'title', 'created_at', 'user_id'],
            where: { board_id },
            order: [['created_at', 'DESC']],
            limit: 10,                         // 최대 10개만
            include: [{
                model: User,
                attributes: ['name'],      // 작성자 닉네임
            }]
        });

        return boardPosts;
    } catch (error) {
        console.error("게시판 목록 조회 실패:", error.message);
        throw error;
    }
};

// 게시글 상세 조회
async function getPost(post_id) {
    try {
        const posts = await Post.findOne({
            attributes: [ 'title', 'content', 'created_at', 'user_id'],
            where: { post_id },
            include: [{
                model: User,
                attributes: ['name'],      // 작성자 닉네임
            }]
        });

        return posts;
    } catch (error) {
        console.error("게시글 조회 실패:", error.message);
        throw error;
    }
};

//  게시글 작성
//async function createPost({board_id, user_id, content}) {

//};

module.exports = {
    getBoardList,
    getBoardPost,
    getPost,
};