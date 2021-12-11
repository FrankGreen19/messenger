const Router = require('express').Router;
const sequelize = require('../models/index');
const messageController = require('../controllers/messageController');

const messageRouter = Router();

messageRouter.route('/room/:id')
    .get(async (req, res) => {
        try {
            let messages = await messageController.getMessagesByRoomId(req.params.id);
            res.send(messages);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    })

module.exports = messageRouter;