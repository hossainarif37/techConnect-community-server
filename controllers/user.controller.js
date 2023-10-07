const { isAuthenticateUser } = require("../middleware/authorization");
const Article = require("../models/article.model")

exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
}

//* Get user articles by their ID
exports.getUserArticles = async (req, res, next) => {
    try {
        const articles = await Article.find({ author: req.params.id });
        if (!articles.length) {
            return res.status(404).json({ message: 'Articles not found' })
        }
        res.status(200).json(articles);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}