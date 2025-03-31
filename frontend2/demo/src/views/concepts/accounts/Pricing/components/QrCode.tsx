import React from 'react';
import QRCode from 'qrcode-generator';

interface PaymentQRCodeProps {
    qrCode: string;  // Xác định kiểu của qrCode là string
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ qrCode }) => {
    const qr = QRCode(0, 'L');
    qr.addData(qrCode);
    qr.make();

    return (
        <div dangerouslySetInnerHTML={{ __html: qr.createSvgTag(5) }} />
    );
};

export default PaymentQRCode;
