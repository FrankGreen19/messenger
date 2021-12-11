const express = require('express');
const app = express();
const ws = require('ws');
const server = require('http').createServer(app);
const config = require('./config');
const cors = require('cors');

require('dotenv').config();

const wss = new ws.Server({server});

app.use(cors());
app.use(express.json());

const userRouter = require('./routers/userRouter');
const roomRouter = require('./routers/roomRouter');
const roomUserRouter = require('./routers/roomUserRouter');
const messageRouter = require('./routers/messageRouter');

app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use('/room-user', roomUserRouter);
app.use('/message', messageRouter);

const messageController = require('./controllers/messageController');

wss.on('connection', function connection(socket) {

    socket.on('message', async function (message) {
        message = JSON.parse(message);

        switch (message.event) {
            case 'message':
                const result = await messageController.saveMessage(message)
                broadcastMessage(message);
                break;
            case 'connection':
                socket.roomId = message.roomId;
                message.body = `${message.user.firstName} присоединился!`
                broadcastMessage(message);
                break;
        }
    })

    console.log('Socket connected', socket.id);
});


function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    })
}

const port = config.port;
server.listen(port, (err) => {
   if (err) {
       throw Error(err);
   }
   console.log("Сервер запущен");
});