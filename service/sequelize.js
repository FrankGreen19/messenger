const { Sequelize } = require('sequelize');
const { db } = require('../config');

const sequelize = new Sequelize(`postgres://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`)

connect().then(r => {});

async function connect () {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
