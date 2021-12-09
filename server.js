const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
const config = require('./config');
const cors = require('cors');
const sequelize = require('./models/index');
require('dotenv').config()

app.use(cors());
app.use(express.json());

const userRouter = require('./routers/userRouter');
const roomRouter = require('./routers/roomRouter');
const roomUserRouter = require('./routers/roomUserRouter');

app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use('/room-user', roomUserRouter);

let rooms = [];

app.get('/rooms/:id', async (req, res) => {
    const {id: roomId} = req.params;
    const obj = rooms.has(roomId)
        ? {
            users: [...rooms.get(roomId).get('users').values()],
            messages: [...rooms.get(roomId).get('messages').values()],
        }
        : await sequelize.Room.findAll({
            where: {
                userId: 1
            }
        });
    res.json(obj);
});

io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId); //загрузка информации о беседе в сокет
        rooms.get(roomId).get('users').set(socket.id, userName); //загрузка информации о беседе в мэп
        const users = [...rooms.get(roomId).get('users').values()];
        socket.broadcast.to(roomId).emit('ROOM:JOINED', users); //установление сокет соединения с участниками беседы
    });

    socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
        const obj = {
            userName, text
        };
        rooms.get(roomId).get('messages').push(obj);
        socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj); //установление сокет соединения с участниками беседы
    });

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users); //установление сокет соединения с участниками беседы
            }
        })
    });

    console.log('Socket connected', socket.id);
});

const port = config.port;
server.listen(port, (err) => {
   if (err) {
       throw Error(err);
   }
   console.log("Сервер запущен");
});