const Router = require('express').Router;
const sequelize = require('../models/index');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const userRouter = Router();

userRouter.route('/registration')
    .post(async (req, res) => {
        try {
            let token = await userController.registration(req);
            res.send({token: token})
        } catch (error) {
            res.status(400).send(error);
        }
    });

userRouter.route('/login').
    post(async (req, res) => {
        try {
            let token = await userController.login(req);
            res.send({token: token})
        } catch (error) {
            res.status(400).json({message: error});
        }
    });

userRouter.route('/auth').
    get(authMiddleware, async (req, res) => {
        const token = await userController.check(req);
        res.send(token);
    });

userRouter.route('/')
    .get(async function(req, res) {
       try {
           let users = await sequelize.Model.findAll();
           res.send(users);
       } catch (error) {
            console.error(error);
            res.status(500).send();
       }
    });

userRouter.route('/')
    .post(async function(req, res) {
        try {
            const user = await sequelize.Model.build({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            if (await user.save()) {
                res.send(user);
            } else {
                res.status(500).send();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });

module.exports = userRouter;