const WebSocket = require('ws');

const wsServer = new WebSocket.Server({port: 9000});

wsServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log('Новый пользователь');
    wsClient.send('Привет');
    wsClient.on('message', (message) => {
        try {
            const jsonMessage = JSON.parse(message);
            switch (jsonMessage) {
                case 'ECHO':
                    wsClient.send(jsonMessage.data);
                    break;
                case 'PING':
                    setTimeout(function() {
                        wsClient.send('PONG');
                    }, 2000);
                    break;
                default:
                    console.log('Неизвестная команда');
                    break;
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    });
    wsClient.on('close', function() {
        // отправка уведомления в консоль
        console.log('Пользователь отключился');
    });
}

console.log('Сервер запущен на 9000 порту');

