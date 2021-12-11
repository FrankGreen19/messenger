const sequelize = require('../models/index');

class MessageController {
    async saveMessage(message) {
        try {
            return await sequelize.Message.create({
                userId: message.user.id,
                roomId: message.roomId,
                body: message.body
            });
        } catch (e) {
            throw e;
        }
    }

    async getMessagesByRoomId(id) {
        try {
            let room = await sequelize.Room.findOne({
                where: {
                    id,
                }
            });

            if (!room) {
                throw 'Комната не найдена'
            }

            let messages = await room.getMessages();
            let newMessages = [];

            for (let i = 0; i < messages.length; i++) {
                let message = {...messages[i].dataValues};
                let user = await sequelize.User.findOne({
                    where: {
                        id: messages[i].userId
                    }
                });
                message.user = user.dataValues;
                newMessages.push(message);
            }

            let roomUsers = await room.getUsers();

            return newMessages;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = new MessageController();