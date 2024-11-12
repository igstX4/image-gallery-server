const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');


exports.uploadImage = async (req, res) => {
    const { title } = req.body;
    const userId = req.user._id;

    if (!req.file) {
        return res.status(400).send('Файл обязателен');
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        const newImage = new Image({ userId, imageUrl, title });
        await newImage.save();
        res.status(201).send('Изображение загружено');
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
};

exports.getImages = async (req, res) => {
    const userId = req.user._id;

    try {
        const images = await Image.find({ userId });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
};

exports.deleteImage = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const image = await Image.findOne({ _id: id, userId });
        if (!image) {
            return res.status(404).send('Изображение не найдено');
        }

        const imagePath = path.join(__dirname, '..', image.imageUrl);
        fs.unlinkSync(imagePath);

        await Image.deleteOne({ _id: id });
        res.status(200).send('Изображение удалено');
    } catch (error) {
        console.log(error)
        res.status(500).send('Ошибка сервера');
    }
};