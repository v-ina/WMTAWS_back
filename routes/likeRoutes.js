const express = require('express')
const router = express.Router()

const { fidnAllLikesByUser, toggleLike } = require('../controllers/likeControllers')
const { protect } = require('../controllers/authControllers')


router
    .route('')
    .get(protect, fidnAllLikesByUser)

router
    .route('/:id')
    .post(protect, toggleLike)
    .delete(protect, toggleLike)


module.exports = router