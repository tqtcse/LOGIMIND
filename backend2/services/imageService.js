const fs = require('fs');
const { imgDir } = require('../config/env');
const path = require('path');
const multer = require('multer');


if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(imgDir));
    },
    filename: function (req, file, cb) {
        const uploadPath = path.join(imgDir);
        const fileBaseName = path.parse(file.originalname).name;
        const files = fs.readdirSync(uploadPath);


        files.forEach(existingFile => {
            const existingBaseName = path.parse(existingFile).name;
            if (existingBaseName === fileBaseName) {
                fs.unlinkSync(path.join(uploadPath, existingFile));
            }
        });

        cb(null, file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg and .png files are allowed!'), false);
    }
};


const imgUpload = multer({
    storage: imgStorage,
    fileFilter: imageFilter,
});

const uploadImg = (req, res) => {
    const uploadMiddleware = imgUpload.single('file')
    uploadMiddleware(req, res, (err) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ message: 'ImgFile uploaded successfully', file: req.file });
    })
}

const getImg = (req, res) => {
    let fileName = req.params.filename;
    let filePath = path.join(imgDir, fileName);

    if (!fs.existsSync(filePath)) {
        // Thử thêm phần mở rộng mặc định
        const extensions = [".jpg", ".png", ".jpeg", ".gif"];
        let found = false;

        for (let ext of extensions) {
            let testPath = path.join(imgDir, fileName + ext);
            if (fs.existsSync(testPath)) {
                filePath = testPath;
                found = true;
                break;
            }
        }

        if (!found) {
            return res.status(404).json({ error: "File không tồn tại" });
        }
    }

    res.sendFile(filePath);
}

const deleteImg = (req, res) => {
    const imgDir2 = path.join(imgDir);
    const imageName = req.params.name;


    const extensions = [".jpg", ".png", ".jpeg", ".gif"];
    let deleted = false;

    for (let ext of extensions) {
        const filePath = path.join(imgDir2, imageName + ext);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deleted = true;
            break;
        }
    }

    if (deleted) {
        res.json({ message: `Ảnh "${imageName}" đã được xóa thành công!` });
    } else {
        res.status(404).json({ error: `Không tìm thấy ảnh có tên "${imageName}"` });
    }
}

module.exports = { uploadImg, getImg, deleteImg };