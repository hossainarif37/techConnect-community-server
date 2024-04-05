import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

const Article = require('../models/article.model')
import User from '../models/user.model';

// Define a type for the query object
type QueryType = {
    author: string;
    category?: { $in: string[] };
};

//* Creates a new article
exports.createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = new Article({ ...req.body, author: (req.user as IUser)._id });
        await article.save();
        // * Get the user's ObjectId
        const authorId = (req.user as IUser)._id;

        //* Update the user's document to include the new article's ObjectId
        await User.findByIdAndUpdate(authorId, { $push: { articles: article._id } });

        res.status(201).json({
            success: true,
            message: "Post Created Successfully",
        })
    } catch (error) {
        console.log('Create Article Controller: ', (error as Error).message);
        next(error);
    }
}

//* Get all articles
exports.getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 }).populate('author', '-password -email -savedArticles');
        res.status(200).json(articles)
    } catch (error) {
        console.log('Get All Articles Controller: ', (error as Error).message);
        next(error);
    }
}


//* Get Articles by User ID
exports.getArticlesByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Assuming categories is an array of categories from the query parameters
        const categories = req.query.category;

        /// Initialize the query object with the defined type
        let query: QueryType = { author: req.params.userId };

        // If categories are provided and is an array, add them to the query
        if (Array.isArray(categories) && categories.length > 0) {
            query.category = { $in: categories.map(category => String(category)) };
        }


        // Filter articles based on the query
        const posts = await Article.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name profilePicture');

        if (!posts.length) {
            return res.status(404).json({ success: false, message: 'Posts not found' });
        }
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log('Get Articles By User Controller: ', (error as Error).message);
        next(error);
    }
};