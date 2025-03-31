const db = require('../config/db');


const deleteAccount = (req, res) => {
    const { id } = req.params;
    const userRole = req.user.rule;

    if (userRole !== 0) {
        return res.status(403).json({ error: 'Bạn không có quyền xóa tài khoản!' });
    }

    const sql = `DELETE FROM account WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa tài khoản:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ khi xóa tài khoản' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
        }
        res.json({ message: 'Xóa tài khoản thành công!' });
    });
}


module.exports = { deleteAccount };