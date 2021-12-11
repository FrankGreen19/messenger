const sequelize = require('../models/index');

class RoomController {
    async getRoomDataById(id) {
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

        room.dataValues.messages = newMessages;
        room.dataValues.users = roomUsers;

        return room;
    }
}

module.exports = new RoomController();