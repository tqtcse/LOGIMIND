const db = require('../config/db');


const getAllOrderDetail = (req, res) => {
    const sql = 'SELECT * FROM OrderDetail';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }
        res.json(results);
    })
}

const addOrderDetail = (req, res) => {
    const { id_account, id_package, expired_datetime } = req.body;

    if (!id_account || !id_package || !expired_datetime) {
        return res.status(400).json({ message: 'id_account, id_package và expired_datetime là bắt buộc!' });
    }

    const sql = `
        INSERT INTO OrderDetail (id_account, id_package, expired_datetime) 
        VALUES (?, ?, ?)
    `;

    db.query(sql, [id_account, id_package, expired_datetime], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm OrderDetail:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }
        res.status(201).json({ message: 'Thêm OrderDetail thành công!', id: result.insertId });
    });
}


const getOrderDetailByID = (req, res) => {
    const { id_account } = req.params;

    if (!id_account) {
        return res.status(400).json({ message: 'id_account là bắt buộc!' });
    }

    const sql = `SELECT * FROM OrderDetail WHERE id_account = ? ORDER BY expired_datetime DESC`;

    db.query(sql, [id_account], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách OrderDetail:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào!' });
        }

        res.status(200).json(results);
    });
}

module.exports = { getAllOrderDetail, addOrderDetail, getOrderDetailByID };