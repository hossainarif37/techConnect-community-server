const { default: mongoose, Schema, model } = require('mongoose');
const { ValidationError } = require('../errorHandlers/validationError');

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

articleSchema.pre('save', function (next) {
    const { title, content, category, author } = this;
    if (!title || !content || !category || !author) {
        const validationError = new ValidationError('Title, Content, Category and Author is Required');
        return next(validationError);
    }
    next();
})

module.exports = model('Article', articleSchema);
