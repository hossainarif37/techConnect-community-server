const Article = require('../models/article.model')
const User = require('../models/user.model')

//* Creates a new article
exports.createArticle = async (req, res, next) => {
    try {
        const article = new Article({ ...req.body, author: req.user._id });
        await article.save();
        // * Get the user's ObjectId
        const authorId = req.user._id;
        //* Update the user's document to include the new article's ObjectId
        await User.findByIdAndUpdate(authorId, { $push: { articles: article._id } });

        res.status(201).json({
            success: true,
            message: "Article Saved Successfully",
            article
        })
    } catch (error) {
        next(error);
    }
}

//* Get all articles
exports.getAllArticles = async (req, res, next) => {
    try {
        const articles = await Article.find().populate('author', '-password -email -savedArticles');
        res.status(200).json(articles)
    } catch (error) {
        next(error);
    }
}

