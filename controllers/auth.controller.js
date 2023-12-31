const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const saltRounds = 10;

//* User Registration Controller 
exports.registerUser = async (req, res, next) => {
    try {
        const { email, password, name, profilePicture } = req.body;
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
            try {
                //* user info
                const newUser = new User({
                    name,
                    email,
                    password: hash,
                    profilePicture
                });

                //* save the user
                await newUser.save();

                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully.'
                })
            } catch (error) {
                next(error)
            }

        });

    } catch (error) {
        next(error);
    }
}

//* User Login Controller 
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //* Validate that 'email' and 'password' fields are present in the request body
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email or Password is required' })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, error: 'User not found' })
        }

        const payload = {
            id: user._id,
            email: user.email
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                //* Generate jwt token
                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
                res.status(200).send({
                    success: true,
                    message: "Login in successfully",
                    token: `Bearer ${token}`,
                    user
                })
            } else {
                res.status(401).send({ success: false, error: 'Wrong password' })
            }
        });



    } catch (error) {
        next(error);
    }
}

//* User Logout
exports.logOutUser = async (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            //    res.redirect('/');
            res.send({ isLogout: true });
        });
    } catch (error) {
        next(error);
    }
}