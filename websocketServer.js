const WebSocket = require('ws');
const { User } = require('./models/User'); 

const wss = new WebSocket.Server({ port: 8081 }); // Подключение WebSocket сервера на порту 8081
const connections = {}; // Объект для хранения подключений по authToken

// Обработка подключения нового клиента WebSocket
const getConnection = (authToken) => connections[authToken];
wss.on('connection', (ws) => {
    console.log('Клиент подключился');

    ws.on('message', (message) => {
        try {
            const { authToken } = JSON.parse(message);
            connections[authToken] = ws; // Сохраняем подключение для authToken
            // В случае ошибок, выводим информацию в консоль
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

// Функция для отправки сообщений пользователю через WebSocket
const sendMessageToUser = (authToken, message) => {
    const ws = connections[authToken];
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ success: true, message }));
    }
};

// Экспортируем функцию для отправки сообщений
module.exports = { startWebSocketServer: () => wss, sendMessageToUser };