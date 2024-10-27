import mongoose, { Document, Schema, Types, model } from "mongoose";


export interface IArticle extends Document {
    title: string;
    content: string;
    category: string;
    author: Types.ObjectId;
    comments: Types.ObjectId[];
    likes: Types.ObjectId[];
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
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
        cast: 'Provide a valid author ID',
    },
    comments: [{
        type: Types.ObjectId,
        ref: 'Comment',
    }],
    likes: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Article = model<IArticle>('Article', articleSchema);
export default Article;
