const db = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { SECRET_KEY } = require('../config/env');

const login = (req, res) => {

    const { email, password } = req.body;

    const sql = 'SELECT * FROM account WHERE email = ?';

    db.query(sql, [email], async (err, result) => {

        if (err) return res.status(500).json({ error: 'Lỗi server' });
        if (result.length === 0) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }
        const user = result[0];

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        if (hashedPassword != user.password) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            rule: user.rule || 0
        };

        try {
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

            return res.json({ message: 'Đăng nhập thành công', token });
        } catch (error) {
            console.error("JWT Error:", error);
            return res.status(500).json({ error: 'Lỗi tạo token' });
        }


    })
};

const register = (req, res) => {

    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu không khớp!' });
    }

    db.query('SELECT * FROM account WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi server' });
        if (result.length > 0) return res.status(400).json({ message: 'Email đã tồn tại' });

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const sql = 'INSERT INTO account (id, username, password, email, rule, updated_datetime, created_datetime) VALUES (UUID(), ?, ?, ?, 1, NOW(), NOW())';

        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) return res.status(500).json({ message: 'Lỗi server khi đăng ký tài khoản' });

            const token = jwt.sign({ id: result.insertId, username, email, rule: 1 }, SECRET_KEY, { expiresIn: '1h' });

            return res.json({ message: 'Đăng ký thành công', token });
        });
    });
};

module.exports = { login, register };
