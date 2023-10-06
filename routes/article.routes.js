const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');

router
    //* Creates a new article
    /**
 * @route POST /api/article
 * @description Create a new article.
 * @access Public
 *
 * @param {string} title - The title of the article (required).
 * @param {string} content - The content of the article (required).
 * @param {string} category - The category to which the article belongs (required).
 * @param {string} author - The ID of the author who created the article (required).
 *
 * @returns {object} - Registration status and message
 *
 * @throws {400} If required fields (`title`, `content`, `category` or `author`) are missing.
 * @throws {500} If there's an Internal Server Error.
 */
    .post('/', articleController.createArticle);







module.exports = router;