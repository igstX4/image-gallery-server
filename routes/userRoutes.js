const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();
const { generateToken, telegramAuth, getMe } = require('../controllers/userController');

/**
 * @swagger
 * /api/users/generate-token:
 *   post:
 *     summary: Генерация случайной длинной строки для пользователя
 *     description: Генерирует случайную строку для аутентификации пользователя.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Данные пользователя для генерации строки
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Случайная строка успешно сгенерирована
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Сгенерированная случайная строка
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post('/generate-token', generateToken);

/**
 * @swagger
 * /api/users/telegram-auth:
 *   post:
 *     summary: Авторизация через Telegram
 *     description: Авторизует пользователя через Telegram с привязкой Telegram ID.
 *     parameters:
 *       - in: body
 *         name: telegramAuth
 *         description: Токен авторизации и Telegram ID
 *         schema:
 *           type: object
 *           required:
 *             - authToken
 *             - telegramId
 *           properties:
 *             authToken:
 *               type: string
 *               description: Токен авторизации
 *             telegramId:
 *               type: string
 *               description: ID пользователя Telegram
 *     responses:
 *       201:
 *         description: Новый пользователь зарегистрирован и авторизован
 *       200:
 *         description: Пользователь авторизован
 *       401:
 *         description: Недействительный токен
 *       500:
 *         description: Ошибка сервера
 */
router.post('/telegram-auth', telegramAuth);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/users/getMe:
 *   get:
 *     summary: Получение данных текущего пользователя
 *     description: Возвращает информацию о текущем пользователе на основе переданного токена.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя успешно получены
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             telegramId:
 *               type: string
 *               nullable: true
 *       401:
 *         description: Недействительный токен
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/getMe', authenticateToken, getMe);

module.exports = router;