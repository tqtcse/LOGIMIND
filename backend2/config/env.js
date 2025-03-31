require('dotenv').config();
const path = require('path');

const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || "../app/data");
const imgDir = path.resolve(__dirname, process.env.IMG_DIR || "../img");

module.exports = {
    WS_PORT: process.env.WS_PORT || 8080,
    WS_PORT2: process.env.WS_PORT2 || 8081,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    SERVER_PORT: process.env.SERVER_PORT || 3000,
    PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID,
    PAYOS_API_KEY: process.env.PAYOS_API_KEY,
    PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY,
    SECRET_KEY: process.env.JWT_SECRET || 'my_secret_key',
    DB_CONFIG: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    },
    uploadDir,
    imgDir,
    API_BASE_URL_MODEL: process.env.API_BASE_URL_MODEL
};
