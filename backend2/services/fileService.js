const fs = require('fs');
const { uploadDir } = require('../config/env');
const path = require('path');
const multer = require('multer');
const iconv = require('iconv-lite');

function isEncodingError(text) {
    // Kiểm tra xem chuỗi có chứa ký tự lỗi encoding không
    return /[\uFFFD]/.test(text) || /áº|Ã|Â|Ð|Ø|æ|½|¤/.test(text);
}

function fixVietnameseEncoding(text) {
    if (isEncodingError(text)) {
        let buffer = Buffer.from(text, "binary");
        return iconv.decode(buffer, "utf-8");
    }
    return text; // Nếu không có lỗi, trả về nguyên bản
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(uploadDir));
    },
    filename: function (req, file, cb) {
        var name = fixVietnameseEncoding((file.originalname))
        cb(null, name);
    }
});

const upload = multer({ storage });

const getFiles = (req, res) => {
    try {

        console.log(uploadDir)
        const files = fs.readdirSync(uploadDir).map(file => {
            const filePath = path.join(uploadDir, file);
            const stats = fs.statSync(filePath);

            return {
                name: file,
                type: path.extname(file).substring(1) || "unknown",
                size: stats.size,
                lastModified: stats.mtime.toISOString(),
            };
        });

        res.json(files);
    } catch (error) {
        console.error("Lỗi khi đọc thư mục:", error);
        res.status(500).json({ error: "Không thể đọc thư mục" });
    }
}

const uploadFiles = (req, res) => {
    const uploadMiddleware = upload.single('file')
    uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        res.json({
            message: 'File uploaded successfully',
            file: req.file
        });
    });
}

const deleteFiles = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    console.log(filePath)
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File không tồn tại" });
    }

    // Xóa file
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: "Không thể xóa file" });
        }
        res.json({ message: "File đã được xóa thành công" });
    });
}

const downloadFiles = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File không tồn tại" });
    }

    // Gửi file về FE
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Lỗi khi tải file:", err);
            res.status(500).json({ error: "Không thể tải file" });
        }
    });
}

module.exports = { getFiles, uploadFiles, deleteFiles, downloadFiles };