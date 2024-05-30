const { sequelize, User, Message, MessageUserFk } = require('../db/sequelizeSetup')
const { Op } = require('sequelize');


const findAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({include: [{ model: MessageUserFk, include: [
            {model:User, as:"Sender"}, {model:User, as:"Receiver"}
        ] }]});
        return res.status(200).json({ message: `${messages.length}개의 메시지가 있습니다.`, data: messages });
    } catch (error) {
        return res.status(500).json({ error: '메시지 조회 중 오류 발생' });
    }
};


const createMessage = async (req, res) => {
    const { content, send_userId, receive_userId } = req.body;
    try {
        const message = await Message.create({ content });
       
        await MessageUserFk.create({
            messageId: message.id,
            send_userId,
            receive_userId
        });
        return res.status(201).json(message);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ error: '메시지 생성 중 오류 발생' });
    }
};


const getLastMessagesForUser = async (req, res) => {
    const { receiverId } = req.query;
    try {
        const messages = await Message.findAll({
            include: [
                {
                    model: MessageUserFk,
                    where: {
                        [Op.or]: [
                            { receive_userId: receiverId },
                            { send_userId: receiverId }
                        ]
                    },
                    include: [
                        { model: User, as: 'Sender' },
                        { model: User, as: 'Receiver' }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const otherUserIds = new Set();
        messages.forEach(message => {
            message.MessageUserFks.forEach(messageUserFk => {
                if (messageUserFk.send_userId !== receiverId) {
                    otherUserIds.add(messageUserFk.send_userId);
                }
                if (messageUserFk.receive_userId !== receiverId) {
                    otherUserIds.add(messageUserFk.receive_userId);
                }
            });
        });

        const otherUserIdsArray = Array.from(otherUserIds).filter(id => id !== parseInt(receiverId));
        const latestMessages = await Promise.all(otherUserIdsArray.map(async userId => {
            const latestMessageFk = await MessageUserFk.findOne({
                where: {
                    [Op.or]: [
                        { send_userId: userId, receive_userId: receiverId },
                        { send_userId: receiverId, receive_userId: userId }
                    ]
                },
                order: [['messageId', 'DESC']],
                include: [
                    { model: User, as: 'Sender' },
                    { model: User, as: 'Receiver' },
                    { model: Message }
                ]
                });
            return latestMessageFk ? latestMessageFk : null;
        }));
        res.json(latestMessages)
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getMessagesBetweenUsers = async (req, res) => {
    const { receiverId, senderId } = req.query;
    try {
        const messageUserFks = await MessageUserFk.findAll({
            where: {
                [Op.or]: [
                    {
                        send_userId: senderId,
                        receive_userId: receiverId
                    },
                    {
                        send_userId: receiverId,
                        receive_userId: senderId
                    }
                ]
            },
            attributes: ['messageId'],
            raw: true
        });
        const messageIds = messageUserFks.map(entry => entry.messageId);
        const messages = await Message.findAll({
            where: {
                id: {
                    [Op.in]: messageIds
                }
            },
            include: [
                {
                    model: MessageUserFk,
                    include: [
                        { model: User, as: 'Sender' },
                        { model: User, as: 'Receiver' }
                    ]
                }
            ],
            order: [['createdAt', 'ASC']]
        });
        

            await Promise.all(messages.map(async (message) => {
                await MessageUserFk.update(
                    { status: true }, 
                    { where: { messageId: message.id } } 
                );
            }));
            res.json(messages);
        
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };


const getUnreadMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const unreadMessages = await Message.findAll({
            include: [{
                model: MessageUserFk,
                where: {
                    receive_userId: userId
                }
            }],
            where: {
                status: false
            }
        });

        // if (unreadMessages.length === 0) {
        //     return res.status(404).json({ error: '읽지 않은 메시지가 없습니다.' });
        // }
        return res.status(200).json(unreadMessages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '읽지 않은 메시지를 가져오는 중 오류 발생' });
    }
};


const findMessageById = async (req, res) => {
    const { id } = req.params;
    try {
        let message = await Message.findByPk(id, {include: [{ model: MessageUserFk, include: [
            {model:User, as:"Sender"}, {model:User, as:"Receiver"}
        ] }]});
        if (!message) {
            return res.status(404).json({ error: '메시지를 찾을 수 없음' });
        }
        message = await message.update({ status: true });
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ error: '메시지 조회 중 오류 발생' });
    }
}; 


const updateMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Message.update(req.body, { where: { id } });
        if (updated) {
            const updatedMessage = await Message.findByPk(id);
            return res.status(200).json(updatedMessage);
        }
        throw new Error('메시지를 업데이트할 수 없음');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Message.destroy({ where: { id } });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('메시지를 삭제할 수 없음');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { findAllMessages, findMessageById, getUnreadMessages, getMessagesBetweenUsers, createMessage, updateMessage, deleteMessage , getLastMessagesForUser};