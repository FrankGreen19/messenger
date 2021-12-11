const Router = require('express').Router;
const sequalize = require('../models/index');

const roomUserRouter = Router();

roomUserRouter.route('/users/:roomId')
    .get(async function (req, res) {
        try {
            let room = await sequalize.Room.findOne({
                where: {
                    id: req.params.roomId,
                }
            });

            let roomUsers = await room.getUsers();
            res.send(roomUsers);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

roomUserRouter.route('/rooms/:userId')
    .get(async function (req, res) {
        try {
            let user = await sequalize.User.findOne({
                where: {
                    id: req.params.userId,
                }
            });

            let userRooms = await user.getRooms();
            res.send(userRooms);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

roomUserRouter.route('/')
    .post(async function(req, res) {
        try {
            const roomUser = await RoomUserModel.build({
                roomId: req.body.roomId,
                userId: req.body.userId
            });

            if (await roomUser.save()) {
                res.send(roomUser);
            } else {
                res.status(500).send();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

module.exports = roomUserRouter;