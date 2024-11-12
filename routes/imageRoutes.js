const express = require('express');
const router = express.Router();
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: Загрузить изображение
 *     description: Загрузка изображения пользователем
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Токен авторизации пользователя
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Файл изображения для загрузки
 *               title:
 *                 type: string
 *                 description: Название изображения
 *     responses:
 *       201:
 *         description: Изображение успешно загружено
 *       400:
 *         description: Ошибка валидации или отсутствует файл
 *       401:
 *         description: Неавторизован
 */
router.post('/', authenticateToken, upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Получить список изображений
 *     description: Возвращает список изображений пользователя
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Токен авторизации пользователя
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список изображений успешно получен
 *       401:
 *         description: Неавторизован
 */
router.get('/', authenticateToken, getImages);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: Удалить изображение
 *     description: Удаление изображения по ID
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Токен авторизации пользователя
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID изображения
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Изображение успешно удалено
 *       401:
 *         description: Неавторизован
 *       404:
 *         description: Изображение не найдено
 */
router.delete('/:id', authenticateToken, deleteImage);

module.exports = router;
