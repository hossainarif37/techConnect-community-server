const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authorization');
const likeController = require('../controllers/like.controller');

router
    .post('/:articleId', checkAuth, likeController.likeArticle)


module.exports = router;