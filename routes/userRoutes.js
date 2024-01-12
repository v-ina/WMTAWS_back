const express = require('express')
const router = express.Router()
const multer = require('../middlewares/multer-config-userphoto')

const { findAllUsers, findUserByPk, createUser, updateUser, deleteUser, findLostUserId, findLostUserPassword } = require('../controllers/userControllers')
const { login, protect, restrict, checkUser, loginWithoutHashing } = require('../controllers/authControllers')


router
    .route('')
    .get(protect, restrict('superadmin'), findAllUsers)
    .post(createUser)

router
    .route('/login')
    .post(login)

router
    .route('/:id')
    .get(findUserByPk)
    .put(protect, checkUser, multer, updateUser)
    .delete(protect, checkUser, deleteUser)

router 
    .route('/:email/:firstname/:birthdate')
    .get(findLostUserId)

router 
    .route('/:username/:email/:firstname/:birthdate')
    .post(findLostUserPassword, loginWithoutHashing)

module.exports = router