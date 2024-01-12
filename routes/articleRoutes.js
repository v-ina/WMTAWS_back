const express = require('express')
const router = express.Router()
const multer = require('../middlewares/multer-config-attachment')

const { findAllArticles, findArticleByPk, createArticle, updateArticle, deleteArticle } = require('../controllers/articleControllers')
const { protect, restrictOwnAuthor } = require('../controllers/authControllers')
const {Article} = require('../db/sequelizeSetup')


router
    .route('')
    .get(findAllArticles)
    .post(protect, multer, createArticle)

router
    .route('/:id')
    .get(findArticleByPk)
    .put(protect, restrictOwnAuthor(Article), multer, updateArticle)
    .delete(protect, restrictOwnAuthor(Article), deleteArticle)
 
    
module.exports = router