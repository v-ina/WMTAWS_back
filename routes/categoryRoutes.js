const express = require('express')
const router = express.Router()

const { findCategoryByLabel } = require('../controllers/categoryControllers')


router
    .route('/:id')
    .get(findCategoryByLabel)

    
module.exports = router