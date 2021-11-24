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

app.use(cors());
app.use(express.json());

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
    const {id: roomId} = req.params;
    const obj = rooms.has(roomId)
        ? {
            users: [...rooms.get(roomId).get('users').values()],
            messages: [...rooms.get(roomId).get('messages').values()],
        }
        : { users: [], messages: [] };
    res.json(obj);
});

app.post('/', (req, res) => {
   console.log('post-test');

    const { roomId, userName } = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        );
    }
    console.log(rooms);
    res.send();
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