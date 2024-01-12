const express = require('express')
const router = express.Router()

const { findAllSuggestions, createSuggestion , deleteSuggestion } = require('../controllers/suggestionControllers')
const { protect, restrict } = require('../controllers/authControllers')


router
    .route('')
    .get(protect, restrict('admin'), findAllSuggestions)
    .post(protect, createSuggestion)
    
router
    .route('/:id')
    .delete(protect, restrict('admin'), deleteSuggestion)


module.exports = router