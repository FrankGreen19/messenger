const bcrypt = require('bcrypt');
const sequelize = require('../models/index');
const jwt = require('jsonwebtoken');

class UserController {
    async registration(req) {
        let {firstName, lastName, email, password} = req.body;

        email = String(email);
        password = String(password);

        if (!email || !password) {
            throw 'Невалидные данные!';
        }

        if (await sequelize.User.findOne({where: {email}})) {
            throw 'Данный email занят!';
        }

        const hashedPass = await bcrypt.hash(password, 5);

        let user = await sequelize.User.create({
            firstName,
            lastName,
            email,
            password: hashedPass,
        });

        if (!user) {
            throw 'Возникла ошибка при регистрации'
        }

        return await this.generateToken(user);
    }

    async login(req) {
        let {email, password} = req.body;

        email = String(email);
        password = String(password);

        if (!email || !password) {
            throw 'Невалидные данные!';
        }

        let user = await sequelize.User.findOne({where: {email}});
        if (!user) {
            throw 'Пользователь с таким email не найден!';
        }

        const isPassEqual = await bcrypt.compareSync(password, user.password);

        if (!isPassEqual) {
            throw 'Неправильный пароль!';
        }

        return await this.generateToken(user);
    }

    async check(req) {
        return await this.generateToken(req.user);
    }

    async generateToken(user) {
        return jwt.sign({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        );
    }
}

module.exports = new UserController();