const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAuthenticateUser } = require('../middleware/authorization');


router
    //* Get the current user's profile
    //* Route 
    /**
    * @route GET /current-user
    * @description Get if authenticated.
    * @access Private (Requires user authentication)
    */
    //* Middleware
    /**
     * @middleware isAuthenticateUser
     * @description Check if the user is authenticated before allowing access to certain routes.
     * @access Private
    */
    .get('/current-user', isAuthenticateUser, userController.getCurrentUser)

    //* Get articles by user ID
    /**
    * @route GET /api/user/profile/:userId
    * @description Get a user's profile by ID.
    * @access Public
    * 
    * @params userId - The ID of the user to retrieve the profile for.
    * 
    * @returns {object} - User profile information, including articles, followers, and following.
    * 
    * @throws {404} If the user is not found.
    * @throws {500} If there's an internal server error.
    */
    .get('/profile/:userId', userController.getUserProfile)



module.exports = router;