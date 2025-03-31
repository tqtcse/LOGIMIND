const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, WS_PORT2 } = require('../config/env')
const PayOS = require("@payos/node");
const WebSocket = require("ws");


let wss; // Biến WebSocket server toàn cục

// Kiểm tra nếu server chưa chạy thì tạo mới
if (!global.wss) {
    global.wss = new WebSocket.Server({ port: WS_PORT2 });
    console.log(`WebSocket server đang chạy trên cổng ${WS_PORT2}`);
}

wss = global.wss;

const payOS = new PayOS(
    PAYOS_CLIENT_ID,
    PAYOS_API_KEY,
    PAYOS_CHECKSUM_KEY
);

const createPayment = (req, res) => {
    try {
        const formData = req.body;

        const data = {
            clientId: PAYOS_CLIENT_ID,
            ...formData,
        };


        payOS.createPaymentLink(data)
            .then(response => {

                return res.json(response);
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        console.error("Lỗi tạo thanh toán:", error.response?.data || error.message);
        res.status(500).json({ error: "Không thể tạo mã QR thanh toán" });
    }
}

const triggerWebhook = (req, res) => {
    try {
        const webhookData = payOS.verifyPaymentWebhookData(req.body);


        if (webhookData.desc === "success") {

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {

                    client.send(JSON.stringify({
                        amount: webhookData.amount,
                        status: "paid",
                        id: webhookData.description
                    }));
                }
            });
            return res.status(200).json({ success: true, message: "Thanh toán thành công", data: webhookData });
        } else {
            console.log(`Thanh toán thất bại hoặc chưa hoàn tất cho đơn hàng: ${webhookData.orderId}`);
        }

        res.status(200).send("Webhook xử lý thành công");
    } catch (error) {
        console.error("Lỗi khi xử lý Webhook:", error);
        res.status(400).send("Lỗi khi xử lý Webhook");
    }
}

module.exports = { createPayment, triggerWebhook };