import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

import User from '../models/user.model';
import Article from "../models/article.model";
import Comment from "../models/comment.model";
import mongoose, { Types } from "mongoose";
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


export const getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let categories = req.query.categories;

        if (typeof categories === 'string' && categories) {
            categories = categories.split(',');
        }

        const query: CategoryQueryType = {};

        if (Array.isArray(categories) && categories.length > 0) {
            query.category = { $in: categories.map(category => String(category)) };
        }

        // Aggregation pipeline to fetch articles with total comments and latest comment
        const posts = await Article.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: 'users',
                    let: { authorId: "$author" }, // Use the article's `author` field as a variable
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } }, // Match only the specific author
                        { $project: { _id: 1, name: 1, profilePicture: 1 } } // Project only required fields
                    ],
                    as: 'author'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    let: { commentIds: "$comments" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$commentIds"] } } },
                        { $sort: { createdAt: -1 } }, // Sort comments by creation date descending
                        { $limit: 1 }, // Limit to the latest comment
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'authorDetails'
                            }
                        },
                        { $unwind: "$authorDetails" },
                        {
                            $project: {
                                _id: 1,
                                content: 1,
                                createdAt: 1,
                                article: 1,
                                author: {
                                    _id: "$authorDetails._id",
                                    name: "$authorDetails.name",
                                    profilePicture: "$authorDetails.profilePicture"
                                }
                            }
                        }
                    ],
                    as: 'latestComment'
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    author: { $arrayElemAt: ["$author", 0] }, // Get only the required author fields
                    createdAt: 1,
                    totalComments: { $size: "$comments" },
                    latestComment: { $arrayElemAt: ["$latestComment", 0] } // Get the latest comment
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        // Format the posts to include the latest comment and remaining comments count
        const formattedPosts = posts.map(post => ({
            ...post,
            remainingComments: Math.max(post.totalComments - (post.latestComment ? 1 : 0), 0)
        }));

        res.status(200).json({ success: true, posts: formattedPosts });
    } catch (error) {
        console.error('Get All Articles Error:', (error as Error).message);
        next(error);
    }
};


// Get Articles by User ID
export const getArticlesByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let categories = req.query.categories;
        const userId = req.params.userId;

        // Validate and convert userId to ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Initialize query with author
        let query: any = { author: new Types.ObjectId(userId) };

        // Handle categories filtering
        if (typeof categories === 'string' && categories.trim() !== '') {
            categories = categories.split(',').map((cat: string) => cat.trim());
        }

        if (Array.isArray(categories) && categories.length > 0) {
            query.category = { $in: categories };
        }

        // Aggregation pipeline to fetch articles with total comments and latest comment
        const posts = await Article.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: '$author' },
            {
                $lookup: {
                    from: 'comments',
                    let: { commentIds: "$comments" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$commentIds"] } } },
                        { $sort: { createdAt: -1 } }, // Sort comments by creation date descending
                        { $limit: 1 }, // Limit to the latest comment
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'authorDetails'
                            }
                        },
                        { $unwind: "$authorDetails" },
                        {
                            $project: {
                                _id: 1,
                                content: 1,
                                article: 1,
                                createdAt: 1,
                                author: {
                                    _id: "$authorDetails._id",
                                    name: "$authorDetails.name",
                                    profilePicture: "$authorDetails.profilePicture"
                                }
                            }
                        }
                    ],
                    as: 'latestComment'
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    author: {
                        _id: "$author._id",
                        name: "$author.name",
                        profilePicture: "$author.profilePicture"
                    },
                    createdAt: 1,
                    totalComments: { $size: "$comments" },
                    latestComment: { $arrayElemAt: ["$latestComment", 0] }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        // Format the posts to include the latest comment and remaining comments count
        const formattedPosts = posts.map(post => ({
            ...post,
            remainingComments: Math.max(post.totalComments - (post.latestComment ? 1 : 0), 0)
        }));

        res.status(200).json({ success: true, posts: formattedPosts });
    } catch (error) {
        console.error('Get Articles By User Error:', (error as Error).message);
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
        return res.status(200).json({ success: true, message: "Article and its comments deleted successfully" });

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

        const userId = (req.user as IUser)._id;

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