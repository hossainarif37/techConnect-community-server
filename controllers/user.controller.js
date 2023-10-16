const User = require("../models/user.model")

exports.getCurrentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

//* Get user articles by their ID
exports.getUserProfile = async (req, res, next) => {
    try {
        let populateFields = 'articles followers following';
        if (req.user.id === req.params.userId) {
            // If the user is viewing their own profile, populate the 'savedArticles' field
            populateFields += ' savedArticles';
        }

        const userProfile = await User.findById(req.params.userId).populate(populateFields);
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(userProfile);
        // const articles = await Article.find({ author: req.params.userId });
        // if (!articles.length) {
        //     return res.status(404).json({ message: 'Articles not found' })
        // }
        // res.status(200).json(articles);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}