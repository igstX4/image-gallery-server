const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    telegramId: { type: String, unique: true, sparse: true },
    authToken: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);