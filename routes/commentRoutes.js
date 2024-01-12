const express = require('express')
const router = express.Router()

const { findAllComments, findCommentByPk, createComment, updateComment, deleteComment } = require('../controllers/commentControllers')
const { protect, restrictOwnAuthor } = require('../controllers/authControllers')
const {Comment} = require('../db/sequelizeSetup')


router
    .route('')
    .get(findAllComments)
    .post(protect, createComment)

router
    .route('/:id')
    .get(findCommentByPk)
    .put(protect, restrictOwnAuthor(Comment), updateComment)
    .delete(protect, restrictOwnAuthor(Comment), deleteComment)


module.exports = router