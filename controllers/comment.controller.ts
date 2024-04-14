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
        console.log('Create Comment Controller: ', (error as Error).message);
        next(error)
    }
}

//* Get all comments for a specific article
exports.getCommentsByArticleId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleId = req.params.articleId;
        const { limit = 1, skip = 0 } = req.query;
        console.log(req.query);

        // Fetch the total number of comments for the article
        const totalComments = await Comment.countDocuments({ article: articleId });

        // Fetch the comments with limit and skip
        const comments = await Comment.find({ article: articleId }, '-__v')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit as string))
            .skip(skip)
            .populate('author', '_id name profilePicture');

        // Calculate the remaining comments
        const remainingComments = totalComments - comments.length;

        res.status(200).json({ success: true, comments, remainingComments });
    } catch (error) {
        console.log('Get Comments By ArticleId Controller: ', (error as Error).message);
        next(error);
    }
}