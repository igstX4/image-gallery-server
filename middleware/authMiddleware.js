const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticateToken = async (req, res, next) => {
    console.log(req.headers);

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Токен не предоставлен');
    }

    let user = await User.findOne({ authToken: token });

    if (!user) {
        return res.status(401).send('Неверный токен');
    }

    req.user = user;
    next();

};