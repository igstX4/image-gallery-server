const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const startTelegramBot = () => {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

    bot.onText(/\/start/, async (msg, match) => {
        console.log('Команда /start отловлена:', msg);
        const chatId = msg.chat.id;
        const authToken = msg.text.split(' ')[1]; // Токен передан в /start?token=authToken
        console.log(authToken, 21212)
        try {
            // Отправка запроса на ваш бэкенд для проверки/регистрации пользователя
            const response = await axios.post('http://localhost:5000/api/users/telegram-auth', {
                authToken,
                telegramId: chatId
            });

            if (response.data.success) {
                bot.sendMessage(chatId, response.data.message);
            } else {
                bot.sendMessage(chatId, 'Ошибка авторизации. Попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при авторизации через бота:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при авторизации.');
        }
    });

    bot.on('polling_error', (error) => {
        console.error('Ошибка polling:', error.code, error.message);
    });
};

module.exports = startTelegramBot;