const { default: mongoose, } = require("mongoose");
const passport = require('passport');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { ValidationError } = require("../errorHandlers/validationError");
const saltRounds = 10;

//* User Registration Controller 
exports.registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userExist = await User.findOne({ email });
        //* Check user is already exist or not in the database
        if (userExist) {
            return res.status(409).json({
                success: false,
                error: 'Email already exist. Please use a different email or log in'
            })
        }
        //* hash user password
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err?.message === 'data and salt arguments required') {
                const validationError = new ValidationError('Name, Email and Password field are required');
                return next(validationError);
            }
            //* user info
            const newUser = new User({
                name,
                email,
                password: hash
            });
            //* save the user
            await newUser.save();
            return res.status(201).json({
                success: true,
                message: 'User registered successfully.'
            })

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}

//* User Login Controller 
exports.loginUser = async (req, res, next) => {
    //* Validate that 'email' and 'password' fields are present in the request body
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email or Password is required' })
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // If user is found, log them in
        req.logIn(user, function (err) {
            if (info?.passwordError) {
                return res.status(401).json({ success: false, error: 'Wrong password' });
            }
            // Redirect or send a success response
            return res.status(200).json({ success: true, message: 'User LogIn Successfully', user });
        });
    })(req, res, next);
}

//* User Logout
exports.logOutUser = async (req, res, next) => {
    try {
        req.logout((err) => {
            console.log(err);
            if (err) {
                return res.status(500).send('Something went wrong!');
            }
            //    res.redirect('/');
            res.send({ isLogout: true });
        });
    } catch (error) {
        next(error);
    }
}