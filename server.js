require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./models/db');
const { startWebSocketServer } = require('./websocketServer');
const startTelegramBot = require('./telegramBot'); // Импорт бота

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
        startTelegramBot(); // Запуск бота
        console.log('Телеграм-бот запущен');

        // Передаем HTTP-сервер в WebSocket
        startWebSocketServer(server);
    });
});