import { NextFunction, Request, Response } from "express";

import Comment from "../models/comment.model";
import Article from "../models/article.model";
import { IUser } from "../models/user.model";

//* Creates a new comment for an article
exports.createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newComment = new Comment(req.body);
        const response = await newComment.save();

        const articleId = req.body.article;
        await Article.findByIdAndUpdate(articleId, { $push: { comments: newComment._id } });


        res.status(201).json({ success: true, comment: response.content })

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


        // Fetch the total number of comments for the article
        const totalComments = await Comment.countDocuments({ article: articleId });

        // Fetch the comments with limit and skip
        const comments = await Comment.find({ article: articleId }, '-__v')
            .sort({ createdAt: -1 })
            .limit(Number(skip) > 0 ? Number.MAX_SAFE_INTEGER : parseInt(limit as string))
            .skip(parseInt(skip as string))
            .populate('author', '_id name profilePicture');

        // Calculate the remaining comments
        const remainingComments = totalComments - comments.length;

        res.status(200).json({ success: true, comments, remainingComments, totalComments });
    } catch (error) {
        console.log('Get Comments By ArticleId Controller: ', (error as Error).message);
        next(error);
    }
}

// Delete Comment Functionality
exports.deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId, articleId } = req.params;
        const userId = (req.user as IUser)._id;

        // Find the comment to confirm the author
        const comment = await Comment.findById(commentId);
        
        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({success: false, message: "Comment not found" });
        }

        // Check if the user is the author of the comment or the article author
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({success: false, message: "Article not found" });
        }

        const isArticleAuthor = article.author.toString() === userId.toString();
        const isCommentAuthor = comment.author.toString() === userId.toString();

        if (!isArticleAuthor || !isCommentAuthor) {
            return res.status(403).json({success: false, message: "You are not authorized to delete this comment" });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Remove the comment reference from the article's comments array
        article.comments = article.comments.filter(
            (comment) => comment.toString() !== commentId
        );
        await article.save();

        // Return success response
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });

    } catch (error) {
        console.error("Error deleting comment:", error);
        next(error);
    }
};