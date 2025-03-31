import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Segment from '@/components/ui/Segment'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { usePricingStore } from '../store/pricingStore'
import { TbCheck, TbCreditCard, TbMail } from 'react-icons/tb'
import {
    NumericFormat,
    PatternFormat,
    NumberFormatBase,
} from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { PaymentCycle } from '../types'
import axios from 'axios'
import PaymentQRCode from './QrCode'
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_WS_URL = import.meta.env.VITE_WS_URL;
const RETURN_URL = import.meta.env.VITE_RETURN_URL;
const CANCEL_URL = import.meta.env.VITE_CANCEL_URL;


interface Package {
    id: string;
    price: number;
    package_name: string;
    day: string
}





const PaymentDialog = () => {
    const [qrCode, setQrCode] = useState();
    const [price, setPrice] = useState(Number(localStorage.getItem("begin")));


    useEffect(() => {
        // setPaymentSuccessful(true)
        const ws = new WebSocket(`${VITE_WS_URL}`);

        ws.onopen = () => {
            // console.log("WebSocket đã kết nối");
        };

        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.status === "paid") {
                console.log(`Thanh toán thành công! Đơn hàng: ${data}`)

                const price = data.amount
                const id = data.id.replace(/([a-zA-Z]+)(package)$/, '$1_$2');
                const token = localStorage.getItem("token")
                const response = await axios.get(`${API_BASE_URL}/packages/packages`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                console.log(id)
                console.log(response.data)
                const packages: Package[] = response.data;
                // console.log(packages)
                const selectedPackage = packages.find(pkg => pkg.id === id);
                console.log(selectedPackage)
                if (selectedPackage) {
                    if (selectedPackage.price === price) {
                        const days = Number(selectedPackage.day);
                        // console.log(days)
                        // console.log("✅ Giá trùng khớp!");
                        var email = localStorage.getItem("email")
                        if (email) {
                            email = CryptoJS.AES.decrypt(email, secretKey).toString(CryptoJS.enc.Utf8);
                        }
                        const response2 = await axios.post(`${API_BASE_URL}/user/get-user-id?`, { email },

                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },

                        )
                        // console.log(response2.data.id)
                        const userId = response2.data.id;

                        localStorage.setItem("userid", userId)

                        const now = new Date();
                        now.setDate(now.getDate() + days);
                        const expired_datetime = now.toISOString().slice(0, 19).replace("T", " ");

                        const response3 = await axios.post(
                            `${API_BASE_URL}/order/add-order-detail`,
                            {
                                id_account: userId,
                                id_package: selectedPackage.id,
                                expired_datetime: expired_datetime,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        // console.log(response3.data);

                    } else {
                        // console.log("❌ Giá không khớp!");
                        const days = Number(selectedPackage.day);
                        // console.log(days)
                        const years = days * 12;

                        var email = localStorage.getItem("email")
                        if (email) {
                            email = CryptoJS.AES.decrypt(email, secretKey).toString(CryptoJS.enc.Utf8);
                        }
                        const response2 = await axios.post(`${API_BASE_URL}/user/get-user-id?`, { email },

                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },

                        )
                        // console.log(response2.data.id)
                        const userId = response2.data.id;

                        localStorage.setItem("userid", userId)

                        const now = new Date();
                        now.setDate(now.getDate() + years);
                        const expired_datetime = now.toISOString().slice(0, 19).replace("T", " ");

                        const response3 = await axios.post(
                            `${API_BASE_URL}/order/add-order-detail`,
                            {
                                id_account: userId,
                                id_package: selectedPackage.id,
                                expired_datetime: expired_datetime,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        console.log(response3.data);

                    }
                }
                setPaymentSuccessful(true)
            }
        };

        ws.onclose = () => {
            // console.log("WebSocket bị đóng");
        };

        return () => ws.close();
    });


    useEffect(() => {
        // setPaymentSuccessful(true)
        var newPrice2 = localStorage.getItem("begin");
        // console.log("newPrice ", newPrice)
        if (newPrice2) {
            newPrice2 = CryptoJS.AES.decrypt(newPrice2, secretKey).toString(CryptoJS.enc.Utf8);
        }

        var newPrice = Number(newPrice2)
        // console.log("new price", newPrice)
        setPrice(newPrice);

    });

    useEffect(() => {

        // console.log(localStorage.getItem("begin"))
        var price2 = localStorage.getItem("begin");
        if (price2) {
            price2 = CryptoJS.AES.decrypt(price2, secretKey).toString(CryptoJS.enc.Utf8);
        }
        var id = localStorage.getItem("beginid")
        if (id) {
            id = CryptoJS.AES.decrypt(id, secretKey).toString(CryptoJS.enc.Utf8)
        }
        var price = Number(price2)
        // console.log("price ", price)
        // console.log("id ", id)

        const fetchPayment = async () => {
            try {
                // setLoading(true);

                // Dữ liệu gửi lên server
                const requestData = {
                    amount: price,
                    orderCode: Date.now() % 1000000000,
                    currency: 'VND',
                    returnUrl: `${RETURN_URL}`,
                    cancelUrl: `${CANCEL_URL}`,
                    description: id
                };

                // Gọi API tạo checksum trước khi gửi lên server (nếu cần)
                // const checksum = generateChecksum(requestData);
                // requestData.checksum = checksum;
                const token = localStorage.getItem("token")

                const response = await axios.post(`${API_BASE_URL}/payment/create-payment`, requestData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response) {
                    // console.log('Thanh toán thành công:', response);
                    setQrCode(response.data.qrCode)
                    // setPaymentSuccessful(true);
                } else {
                    console.error('Lỗi khởi tạo:', response);
                }
            } catch (err) {
                console.error('Lỗi khởi tạo:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchPayment()
    }, [price])

    const [loading, setLoading] = useState(false)
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)


    const navigate = useNavigate()

    const { paymentDialog, setPaymentDialog, selectedPlan, setSelectedPlan } =
        usePricingStore()

    const handleDialogClose = async () => {
        setPaymentDialog(false)
        await sleep(200)
        setSelectedPlan({})
        setPaymentSuccessful(false)
    }

    const handlePaymentChange = async (paymentCycle: PaymentCycle) => {
        setSelectedPlan({
            ...selectedPlan,
            paymentCycle,
        })
        let value = 0;
        if (selectedPlan?.price) {
            if (selectedPlan.paymentCycle === 'monthly') {
                value = selectedPlan.price.annually ?? 0;
            } else {
                value = selectedPlan.price.monthly ?? 0;
            }
        }
        try {
            // setLoading(true);
            var id = localStorage.getItem("beginid")
            if (id) {
                id = CryptoJS.AES.decrypt(id, secretKey).toString(CryptoJS.enc.Utf8)
            }
            // Dữ liệu gửi lên server
            const requestData = {
                amount: value,
                orderCode: Date.now() % 1000000000, // Tạo orderId duy nhất
                currency: 'VND',
                returnUrl: 'http://localhost:5173/concepts/account/pricing',  // URL trả về khi thanh toán thành công
                cancelUrl: 'http://localhost:5173/concepts/account/pricing',     // URL trả về khi hủy thanh toán
                description: id
            };

            // Gọi API tạo checksum trước khi gửi lên server (nếu cần)
            // const checksum = generateChecksum(requestData);
            // requestData.checksum = checksum;
            const token = localStorage.getItem("token")

            const response = await axios.post(`${API_BASE_URL}/payment/create-payment`, requestData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response) {
                // console.log('Thanh toán thành công:', response);
                setQrCode(response.data.qrCode)
                // setPaymentSuccessful(true);
            } else {
                console.error('Lỗi khởi tạo:', response);
            }
        } catch (err) {
            console.error('Lỗi khởi tạo:', err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Dialog
            isOpen={paymentDialog}
            closable={!paymentSuccessful}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            {paymentSuccessful ? (
                <>
                    <div className="text-center mt-6 mb-2">
                        <div className="inline-flex rounded-full p-5 bg-success">
                            <TbCheck className="text-5xl text-white" />
                        </div>
                        <div className="mt-6">
                            <h4>Thah toán thành công!</h4>

                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-8">

                            <Button
                                block
                                variant="solid"
                                onClick={handleDialogClose}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h4>{selectedPlan.planName} </h4>
                    <div className="mt-6">
                        <Segment
                            defaultValue={selectedPlan.paymentCycle}
                            className="gap-4 flex bg-transparent"
                            onChange={(value) =>
                                handlePaymentChange(value as PaymentCycle)
                            }
                        >
                            {Object.entries(selectedPlan.price || {}).map(
                                ([key, value]) => (
                                    <Segment.Item key={key} value={key}>
                                        {({ active, onSegmentItemClick }) => {
                                            return (
                                                <div
                                                    className={classNames(
                                                        'flex justify-between border rounded-xl border-gray-300 dark:border-gray-600 py-5 px-4 select-none ring-1 w-1/2',
                                                        active
                                                            ? 'ring-primary border-primary'
                                                            : 'ring-transparent bg-gray-100 dark:bg-gray-600',
                                                    )}
                                                    role="button"
                                                    onClick={onSegmentItemClick}
                                                >
                                                    <div>
                                                        <div className="heading-text mb-0.5">
                                                            Thanh toán theo{' '}
                                                            {key === 'monthly'
                                                                ? 'tháng'
                                                                : 'năm'}
                                                        </div>
                                                        <span className="text-lg font-bold heading-text flex gap-0.5">
                                                            <NumericFormat
                                                                displayType="text"
                                                                value={value}
                                                                prefix={'$'}
                                                                thousandSeparator={
                                                                    true
                                                                }
                                                            />
                                                            <span>{'/'}</span>
                                                            <span>
                                                                {key ===
                                                                    'monthly'
                                                                    ? 'tháng'
                                                                    : 'năm'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {active && (
                                                        <TbCheck className="text-primary text-xl" />
                                                    )}
                                                </div>
                                            )
                                        }}
                                    </Segment.Item>
                                ),
                            )}
                        </Segment>
                    </div>
                    <div className="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex justify-center w-full">
                                {qrCode && <PaymentQRCode qrCode={qrCode} />}
                            </div>

                        </div>

                    </div>


                </>
            )}
        </Dialog>
    )
}

export default PaymentDialog
