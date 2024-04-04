const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { checkAuth } = require('../middleware/authorization');

router
    //* Creates a new article
    //* Route
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
    //* Middleware
    /**
     * @middleware isAuthenticateUser
     * @description Check if the user is authenticated before allowing access to certain routes.
     * @access Private
    */
    .post('/', checkAuth, articleController.createArticle)

    //* Get all articles
    /**
 * @route GET /api/articles
 * @description Get all articles.
 * @access Public
 * 
 * @returns {object} - List of all articles
 * 
 * @throws {500} If there's an internal server error
 */
    .get('/', checkAuth, articleController.getAllArticles)



    .get('/:userId', checkAuth, articleController.getArticlesByUser)





module.exports = router;