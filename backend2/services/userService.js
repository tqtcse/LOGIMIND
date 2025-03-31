const db = require('../config/db');


const getAllUser = (req, res) => {
    const sql = 'SELECT * FROM account';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }
        res.json(results);
    })
}

const getUserInfo = (req, res) => {
    const email = req.user.email; // Lấy email từ token đã giải mã

    const sql = `SELECT * FROM account WHERE email = ?`;

    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server khi lấy thông tin người dùng' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.json(result[0]); // Trả về thông tin user
    });
};

const getUserIdByEmail = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email là bắt buộc!' });
    }

    const sql = 'SELECT id FROM account WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
        }
        res.json({ id: result[0].id });
    });
}

const updateUserInfor = (req, res) => {
    const { email, name, username, address, company } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email là bắt buộc!' });
    }

    const sql = `UPDATE account 
                 SET fullname = ?, username = ?, address = ?, company = ? 
                 WHERE email = ?`;

    db.query(sql, [name, username, address, company, email], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        res.json({ message: 'Cập nhật thành công' });
    });
}


module.exports = { getAllUser, getUserInfo, getUserIdByEmail, updateUserInfor };
