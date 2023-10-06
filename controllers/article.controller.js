const Article = require('../models/article.model')

exports.createArticle = async (req, res, next) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.status(201).json({
            success: true,
            message: "Article Saved Successfully",
            article
        })
    } catch (error) {
        next(error);
    }
}