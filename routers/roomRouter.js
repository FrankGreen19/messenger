const Router = require('express').Router;
const sequelize = require('../models/index');
const roomController = require('../controllers/roomController');

const roomRouter = Router();

roomRouter.route('/')
    .get(async function(req, res) {
        try {
            let rooms = await sequelize.Room.findAll();
            res.send(rooms);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

roomRouter.route('/:id')
    .get(async function (req, res) {
        try {
            const room = await roomController.getRoomDataById(req.params.id);

            res.send(room);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

roomRouter.route('/rooms/:userId')
    .get(async function (req, res) {
        try {
            let roomUsers = await sequelize.Room.findAll({
                where: {
                    userId: req.params.userId,
                }
            });
            res.send(roomUsers);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

roomRouter.route('/')
    .post(async function(req, res) {
        try {
            const room = await sequelize.Room.build({
                title: req.body.title,
            });

            if (await room.save()) {
                res.send(room);
            } else {
                res.status(500).send();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

module.exports = roomRouter;
