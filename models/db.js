const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Подключение к базе данных MongoDB успешно');
    } catch (error) {
        console.error('Ошибка подключения к базе данных', error);
        process.exit(1);
    }
};

module.exports = { connectDB };