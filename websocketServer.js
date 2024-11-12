const WebSocket = require('ws');
const { User } = require('./models/User'); 

let wss;
const connections = {}; // Объект для хранения подключений по authToken

const startWebSocketServer = (server) => {
    // Привязываем WebSocket-сервер к уже существующему HTTP-серверу
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Клиент подключился');

        ws.on('message', (message) => {
            try {
                const { authToken } = JSON.parse(message);
                connections[authToken] = ws; // Сохраняем подключение для authToken
            } catch (error) {
                console.error('Ошибка при обработке сообщения WebSocket:', error);
            }
        });

        ws.on('close', () => {
            // Удаляем WebSocket при закрытии соединения
            for (const [token, socket] of Object.entries(connections)) {
                if (socket === ws) {
                    delete connections[token];
                    break;
                }
            }
        });

        ws.onerror = (error) => {
            console.error('Ошибка WebSocket:', error);
        };
    });
};

// Функция для отправки сообщений пользователю через WebSocket
const sendMessageToUser = (authToken, message) => {
    const ws = connections[authToken];
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ success: true, message }));
    }
};

module.exports = { startWebSocketServer, sendMessageToUser };