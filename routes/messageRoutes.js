const express = require('express');
const router = express.Router();

const { findAllMessages, findMessageById, getUnreadMessages, getMessagesBetweenUsers, createMessage, updateMessage, deleteMessage, getLastMessagesForUser } = require('../controllers/messageControllers');

router
    .route('/')
    .get(findAllMessages)
    .post(createMessage);

router
    .route('/last-messages')
    .get(getLastMessagesForUser);

router
    .route('/unread/:userId')
    .get(getUnreadMessages);

router
    .route('/all/:currentUserId')
    .get(getMessagesBetweenUsers);

router
    .route('/:id')
    .get(findMessageById)
    .put(updateMessage)
    .delete(deleteMessage);

module.exports = router;
