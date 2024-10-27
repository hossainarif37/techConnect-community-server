import mongoose, { Document, model, mongo, Schema, Types } from "mongoose";


export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profilePicture: string;
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];
    articles?: Types.ObjectId[];
    savedArticles?: Types.ObjectId[];
    createdAt: Date;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    profilePicture: {
        type: String,
        default: ''
    },
    followers: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    articles: [
        {
            type: Types.ObjectId,
            ref: 'Article'
        }
    ],
    savedArticles: [
        {
            type: Types.ObjectId,
            ref: 'Article'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const User = model<IUser>('User', userSchema);
export default User;