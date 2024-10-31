import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

import User from '../models/user.model';
import Article from "../models/article.model";
import Comment from "../models/comment.model";
// Define a type for the query object
type QueryType = {
    author: string;
    category?: { $in: string[] };
};

type CategoryQueryType = {
    category?: { $in: string[] };
}

// Creates a new article
exports.createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = new Article({ ...req.body, author: (req.user as IUser)._id });
        await article.save();
        // * Get the user's ObjectId
        const authorId = (req.user as IUser)._id;

        // Update the user's document to include the new article's ObjectId
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

// Get all articles
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
            .populate({
                path: 'author',
                select: 'name profilePicture'
            })

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log('Get All Articles Controller: ', (error as Error).message);
        next(error);
    }
}


// Get Articles by User ID
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
            .populate({
                path: 'author',
                select: 'name profilePicture'
            })

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log('Get Articles By User Controller: ', (error as Error).message);
        next(error);
    }
};

// Delete an article with its comments
exports.deleteArticleWithComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        const userId = (req.user as IUser)._id;

        // Find the article to confirm the author
        const article = await Article.findById(articleId);

        // Check if the article exists
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Check if the requesting user is the author of the article
        if (article.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this article" });
        }

        // Delete all comments associated with the article
        await Comment.deleteMany({ _id: { $in: article.comments } });

        // Delete the article itself
        await Article.findByIdAndDelete(articleId);

        // Return success response
        return res.status(200).json({success: true, message: "Article and its comments deleted successfully" });

    } catch (error) {
        console.error("Error deleting article:", error);
        next(error);
    }
};

// Edit an article
exports.editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        const { title, content, category } = req.body;
        
        const userId = (req.user as { _id: string })._id;

        // Find the article to confirm ownership
        const article = await Article.findById(articleId);

        // Check if the article exists
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Check if the user is the owner of the article
        if (article.author.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this article' });
        }

        // Update the article fields
        if (title) article.title = title;
        if (content) article.content = content;
        if (category) article.category = category;

        // Save the updated article
        await article.save();

        // Return success response
        return res.status(200).json({ success: true, message: 'Article updated successfully', article });
    } catch (error) {
        console.error('Error editing article:', error);
        next(error);
    }
};