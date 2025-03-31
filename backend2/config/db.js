const mysql = require('mysql2');
const { DB_CONFIG } = require('./env');

const db = mysql.createConnection(DB_CONFIG);
console.log(DB_CONFIG)

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
    } else {
        console.log('Kết nối MySQL thành công');
    }
});

module.exports = db;
