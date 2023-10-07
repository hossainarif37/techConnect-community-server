const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAuthenticateUser } = require('../middleware/authorization');


router
    //* Get the current user's profile
    //* Route 
    /**
    * @route GET /profile
    * @description Retrieve the user's profile information if authenticated.
    * @access Private (Requires user authentication)
    */
    //* Middleware
    /**
     * @middleware isAuthenticateUser
     * @description Check if the user is authenticated before allowing access to certain routes.
     * @access Private
    */
    .get('/profile', isAuthenticateUser, userController.getUserProfile)

    //* Get articles by user ID
    /**
    * @route GET /api/user/:id/articles
    * @description Get articles by user ID
    * @access Public
    *
    * @param {string} id - User's ID
    *
    * @returns {object} - List of articles by the user
    *
    * @throws {404} If no articles are found for the user
    * @throws {500} If there's an internal server error
    */
    .get('/:authorId/articles', userController.getUserArticles)



module.exports = router;