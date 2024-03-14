import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

const User = require("../models/user.model")
const passport = require('passport');

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, async (err: any, user: IUser) => {
        if (err || !user) {
            // Handle the unauthorized user case here
            return res.status(401).json({ success: false, message: 'Unauthorized access' });
        }
        // let populateFields = 'articles followers following';
        // if (req.user.id === req.params.userId) {
        //     // If the user is viewing their own profile, populate the 'savedArticles' field
        //     populateFields += ' savedArticles';
        // }

        // const userData = await User.findById(user._id).populate({
        //     path: 'articles followers following savedArticles'
        // });
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = {
    checkAuth
}