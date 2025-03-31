const WebSocket = require('ws');
const { WS_PORT } = require('../config/env');

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
    console.log("Client kết nối WebSocket");

    ws.on("message", (message) => {
        console.log("Nhận tin nhắn từ client:", message);
    });

    ws.on("close", () => {
        console.log("Client đã ngắt kết nối");
    });
});

module.exports = wss;
