const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://qweqweq2331:wDuQDWr1zz3hZGfI@cluster0.aojye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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