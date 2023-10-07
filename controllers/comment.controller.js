const Comment = require('../models/comment.model');
const Article = require('../models/article.model');


exports.createComment = async (req, res, next) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();

        const articleId = req.body.article;
        await Article.findByIdAndUpdate(articleId, { $push: { comments: newComment._id } });


        res.status(201).json({ success: true, message: 'Comment created successfully' })

    } catch (error) {
        next(error)
    }
}