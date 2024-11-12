const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMessageToUser } = require('../websocketServer');

// Контроллер для генерации JWT токена
exports.generateToken = async (req, res) => {
    try {
        // Проверка наличия пользователя с указанным email
       
        const { nanoid } = await import('nanoid');
        // Генерация JWT токена
        const token = nanoid(32);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Ошибка при генерации JWT токена:', error);
        res.status(500).send('Ошибка сервера');
    }
};

// Контроллер для авторизации через Telegram
exports.telegramAuth = async (req, res) => {
    const { authToken, telegramId } = req.body;
    console.log(req.body, 111111)
    try {
        let user = await User.findOne({ telegramId });
        if (!user) {
            // Создание нового пользователя
            user = new User({
                email: `telegram_${telegramId}@example.com`, // Генерируем временный email
                password: 'TG', // Пароль можно оставить пустым, так как аутентификация через Телеграм
                telegramId,
                authToken
            });
            await user.save();
            sendMessageToUser(authToken, 'success');
            return res.status(201).json({ success: true, message: 'Новый пользователь зарегистрирован и авторизован' });
        }
        user.authToken = authToken;
        await user.save();

        sendMessageToUser(authToken, 'success');
        // Пользователь найден, возвращаем успешный ответ
        res.status(200).json({ success: true, message: 'Пользователь авторизован' });
    } catch (error) {
        // console.error('Ошибка авторизации через Телеграм:', error);
        res.status(500).send('Ошибка сервера');
    }
};
exports.getMe = async (req, res) => {
    
    try {
        // Проверка токена
        

        // Проверка существования пользователя с данным Telegram ID
        let user = await User.findOne({ authToken: req.user.authToken });
        if (!user) {
            // Создание нового пользователя
            return res.status(404).json({ message: 'Пользователь не найден!' });
        }
        // Пользователь найден, возвращаем успешный ответ
        res.status(200).json(user);
    } catch (error) {
        console.error('Ошибка авторизации через Телеграм:', error);
        res.status(500).send('Ошибка сервера');
    }
};