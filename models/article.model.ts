import mongoose, { Document, Schema, model } from "mongoose";


export interface IArticle extends Document {
    title: string;
    content: string;
    category: string;
    author: Schema.Types.ObjectId;
    comments: Schema.Types.ObjectId[];
    createdAt: Date;
}

const articleSchema = new Schema({
    title: {
        type: String,
        // required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
        cast: 'Provide a valid author ID',
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = model('Article', articleSchema);
