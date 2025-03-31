const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/env');

const verifyToken = (req, res, next) => {

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Không có token' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
