import { NextFunction, Request, Response } from "express";

const Comment = require('../models/comment.model');
const Article = require('../models/article.model');

//* Creates a new comment for an article
exports.createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();

        const articleId = req.body.article;
        await Article.findByIdAndUpdate(articleId, { $push: { comments: newComment._id } });


        res.status(201).json({ success: true, message: 'Comment created successfully' })

    } catch (error) {
        console.log((error as Error).message);
        next(error)
    }
}

//* Get all comments for a specific article
exports.getCommentsByArticleId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleId = req.params.articleId;
        const comments = await Comment.find({ article: articleId }, '-__v').populate('author', '_id name profilePicture');
        res.status(200).json(comments);
    } catch (error) {
        console.log((error as Error).message);
        next(error);
    }
}