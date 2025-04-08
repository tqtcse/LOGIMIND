const db = require('../config/db');


const getAllPackage = (req, res) => {
    const sql = 'SELECT * FROM packages';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL', err);
            return res.status(500).json({ error: 'Lỗi server' });
        }
        res.json(results);
    })
}

const getPackageInforByIdUser = (req, res) => {
    const user_info = req.user
    const id = user_info.id
    const sql = `SELECT * FROM OrderDetail WHERE id_account = ?`;
    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        auser_in4 = result
        res.json(auser_in4)
    })
}

const updatePackage = (req, res) => {
    const { id, packagename, description, price, day } = req.body;


    if (!id) {
        return res.status(400).json({ error: 'ID của gói là bắt buộc!' });
    }

    const sql = `UPDATE packages 
                 SET package_name = ?, description = ?, price = ?, day = ? 
                 WHERE id = ?`;

    db.query(sql, [packagename, description, price, day, id], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật gói:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy gói' });
        }
        res.json({ message: 'Cập nhật gói thành công!' });
    });
}

const addPackage = (req, res) => {
    const { id_package, packagename, description, price, day } = req.body;

    if (!id_package || !packagename || !description || !price || !day) {
        return res.status(400).json({ error: 'Thiếu thông tin cần thiết!' });
    }

    const sql = `INSERT INTO packages (id, package_name, description, price, day) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [id_package, packagename, description, price, day], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm gói mới:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        res.json({ message: 'Thêm gói thành công!', packageId: id_package });
    });
}

const deletePackage = (req, res) => {
    const id_package = req.params.id;

    if (!id_package) {
        return res.status(400).json({ error: 'Thiếu ID của gói!' });
    }

    const sql = `DELETE FROM packages WHERE id = ?`;

    db.query(sql, [id_package], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa gói:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy gói' });
        }
        res.json({ message: 'Xóa gói thành công!' });
    });
}

module.exports = {
    getAllPackage, getPackageInforByIdUser, updatePackage, addPackage,
    deletePackage
};