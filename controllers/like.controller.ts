import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Article from '../models/article.model'; // Adjust the path as needed
import { IUser } from '../models/user.model';

 exports.likeArticle = async (req: Request, res: Response, next: NextFunction) => {
    const { articleId } = req.params;
    const userId = (req.user as IUser)._id as mongoose.Types.ObjectId;

    try {
        // Find the article
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Check if the user has already liked the article
        const userIdStr = userId.toString();
        const likeIndex = article.likes.findIndex((id) => id.toString() === userIdStr);

        if (likeIndex === -1) {
            // Add the user's ID to the likes array if it doesn't exist
            article.likes.push(userId);
            await article.save();
            return res.status(200).json({ message: 'Liked', likes: article.likes.length });
        } else {
            // Remove the user's ID from the likes array if it already exists
            article.likes.splice(likeIndex, 1);
            await article.save();
            return res.status(200).json({ message: 'Removed', likes: article.likes.length });
        }
    } catch (error) {
        console.log('addLike Controller Error:', error);
        next(error);
    }
};
