import mongoose, { Document, Schema, model } from "mongoose";


export interface IComment extends Document {
    content: string;
    author: Schema.Types.ObjectId;
    article: Schema.Types.ObjectId;
    createdAt: Date;
}

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'AuthorId is required'],
        cast: 'Provide a valid authorId'
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, 'ArticleId is required'],
        cast: 'Provide a valid articleId'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Comment', commentSchema);
