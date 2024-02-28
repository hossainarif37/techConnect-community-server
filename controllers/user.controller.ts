import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

const User = require("../models/user.model")

exports.getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

//* Get user articles by their ID
exports.getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let populateFields = 'articles followers following';
        if ((req.user as IUser).id === req.params.userId) {
            // If the user is viewing their own profile, populate the 'savedArticles' field
            populateFields += ' savedArticles';
        }

        const user = await User.findById(req.params.userId).populate(populateFields);
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ success: true, user });
        // const articles = await Article.find({ author: req.params.userId });
        // if (!articles.length) {
        //     return res.status(404).json({ message: 'Articles not found' })
        // }
        // res.status(200).json(articles);
    } catch (error) {
        console.log((error as Error).message);
        next(error);
    }
}