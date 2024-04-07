import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

const Article = require('../models/article.model')
import User from '../models/user.model';

// Define a type for the query object
type QueryType = {
    author: string;
    category?: { $in: string[] };
};

type CategoryQueryType = {
    category?: { $in: string[] };
}

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
        let categories = req.query.categories;
        if (typeof categories === 'string' && categories) {
            categories = categories.split(',');
        }
        const query: CategoryQueryType = {};
        // If categories are provided and is an array, add them to the query
        if (Array.isArray(categories) && categories.length > 0) {
            query.category = { $in: categories.map(category => String(category)) };
        }

        // Filter articles based on the query
        const posts = await Article.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name profilePicture');

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log('Get All Articles Controller: ', (error as Error).message);
        next(error);
    }
}


//* Get Articles by User ID
exports.getArticlesByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let categories = req.query.categories;
        let query: QueryType = { author: req.params.userId };
        if (typeof categories === 'string' && categories) {
            categories = categories.split(',');
        }

        // If categories are provided and is an array, add them to the query
        if (Array.isArray(categories) && categories.length > 0) {
            query.category = { $in: categories.map(category => String(category)) };
        }


        // Filter articles based on the query
        const posts = await Article.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name profilePicture');


        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log('Get Articles By User Controller: ', (error as Error).message);
        next(error);
    }
};