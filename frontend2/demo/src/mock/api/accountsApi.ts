
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import axios from 'axios'


import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

mock.onGet(`/api/setting/billing`).reply(async () => {

    const token = localStorage.getItem("token")
    var id_account = localStorage.getItem("userid")
    if (id_account) {
        id_account = CryptoJS.AES.decrypt(id_account, secretKey).toString(CryptoJS.enc.Utf8);
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/order/get-order-details/${id_account}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });




        const originalData = response.data





        const transformedData = originalData.map((item: any, index: any) => {
            const days = getDaysBetween(item.created_datetime, item.expired_datetime);
            const now = new Date().toISOString();;
            var dayLeft = getDaysBetween(now, item.expired_datetime)
            if (dayLeft < 0) {
                dayLeft = 0
            }
            return {
                id: `#${(index + 1)}`,
                item: item.id_package,
                status: "paid",
                amount: days,
                dayLeft: dayLeft,
                date: new Date(item.created_datetime).getTime() / 1000,
            };
        });


        const finalData = {
            transactionHistory: transformedData

        }

        return [200, finalData]
    } catch (error) {
        console.error("Lỗi khi lấy danh sách OrderDetail:", error);
    }
    const finalData2 = {
        transactionHistory: ''

    }
    return [200, finalData2]
})




mock.onGet(`/api/pricing`).reply(async (config) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/packages/packages`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }

        });


        const transformedPlans = response.data.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.package_name,
            description: pkg.description,
            features: ['001', '002', '003', '004'],
            price: {
                monthly: pkg.price,
                annually: pkg.price * 12
            },
            recommended: false
        }));


        const responseData = {
            featuresModel: [{ id: '', description: '' }],
            plans: transformedPlans
        };


        return [200, responseData]
    } catch (error) {
        console.log("Lỗi :", error)
        return [500, { error: "Lỗi server khi lấy danh sách packages" }];
    }

})
