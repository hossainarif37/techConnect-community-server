const { default: mongoose, } = require("mongoose");
const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                success: false,
                error: 'Email already exist. Please use a different email or log in'
            })
        }
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err?.message === 'data and salt arguments required') {
                const validationError = new Error();
                validationError.name = 'ValidationError';
                return next(validationError);
            }
            const newUser = new User({
                name,
                email,
                password: hash
            });
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