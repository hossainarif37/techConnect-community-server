import mongoose, { Document, model, mongo, Schema } from "mongoose";


export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profilePicture: string;
    followers?: mongoose.Types.ObjectId[];
    following?: mongoose.Types.ObjectId[];
    articles?: mongoose.Types.ObjectId[];
    savedArticles?: mongoose.Types.ObjectId[];
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }
    ],
    savedArticles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }
    ],

})

export default model<IUser>('User', userSchema);