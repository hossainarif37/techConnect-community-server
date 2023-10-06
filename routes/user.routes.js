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



module.exports = router;