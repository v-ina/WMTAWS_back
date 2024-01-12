const express = require('express')
const router = express.Router()

const { findAllReports, createReportOfArticle, createReportOfComment ,deleteReport} = require('../controllers/reportControllers')
const { protect, restrict } = require('../controllers/authControllers')


router
    .route('')
    .get(protect, restrict('admin'), findAllReports)
    
router
    .route('/:id')
    .delete(protect, restrict('admin'), deleteReport)
    
router
    .route('/reportArticle/:articleid')
    .post(protect, createReportOfArticle)

router
    .route('/reportComment/:commentid')
    .post(protect, createReportOfComment)

    
module.exports = router