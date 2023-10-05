const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
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

userSchema.pre('save', function (next) {
    if (!this.name || !this.email || !this.password) {
        const validationError = new Error()
        validationError.name = 'ValidationError'
        next(validationError);
    } else {
        next();
    }
})

module.exports = mongoose.model('User', userSchema);