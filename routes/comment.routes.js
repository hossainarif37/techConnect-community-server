const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router
    //* Creates a new comment for an article
    /**
     * @route POST /api/comments
     * @description Create a new comment for an article.
     * @access Authenticated users
     * 
     * @param {string} content - The content of the comment.
     * @param {string} article - The ID of the article to which the comment belongs.
     * @param {string} author - The ID of the user who authored the comment.
     * 
     * @returns {object} - Status and message indicating the success of comment creation.
     * 
     * @throws {400} Bad Request - Invalid request format or missing fields.
     * @throws {500} Internal Server Error - An error occurred while creating the comment.
     */
    .post('/', commentController.createComment)



module.exports = router;