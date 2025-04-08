import { mock } from '../MockAdapter'
import uniqueId from 'lodash/uniqueId'
import dayjs from 'dayjs'
import CryptoJS from "crypto-js";
import axios from 'axios';


const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL
const API_BASE_URL_MODEL = import.meta.env.VITE_API_BASE_URL_MODEL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type PackageType = "trial_package" | "vip_package" | "max_package";
interface Package {
    created_datetime: string;
    expired_datetime: string;
    id: string;
    id_account: string;
    id_package: PackageType;
    updated_datetime: string;
}
const priorityOrder: Record<PackageType, number> = {
    "trial_package": 3,
    "vip_package": 2,
    "max_package": 1
};


mock.onPost(`/api/ai/chat`).reply(async (config) => {
    const { prompt } = JSON.parse(config.data as string) as { prompt: string }
    // console.log(prompt)


    if (prompt == 'Hãy cho tui thông tin liên quan để hướng dẫn cách tra cứu mã hscode') {
        const response2 = {
            id: uniqueId('ai-conversation-'),
            choices: [
                {
                    finish_reason: 'stop',
                    index: 0,
                    message: {
                        content: `Bạn có thể dùng một số mẫu sau để tra cứu HS Code:

- Mã HS Code '...'
- Mã HS Code '...' (Nhập | Xuất)
- Mã HS Code '...' từ nhà cung cấp '...'
- Mã HS Code '...' từ nhà cung cấp '...' (Nhập | Xuất)
- Mã HS Code '...' từ nhà cung cấp '...', ngày '...'
- Mã HS Code '...' từ nhà cung cấp '...', ngày '...' (Nhập | Xuất)
- Mã HS Code '...' từ nhà cung cấp '...', từ ngày '...' đến '...'
- Mã HS Code '...' từ nhà cung cấp '...', từ ngày '...' đến '...' (Nhập | Xuất) \n
- **Ví dụ:** Cho tui thông tin liên quan về mã HS Code 07031029 nhà cung cấp YUNNAN KAIZHI, từ ngày 15/09/2025 đến 25/09/2025

                        `,
                        role: 'assistant',
                    },
                },
            ],
            created: dayjs().unix(),
            model: 'gpt-4',
        }

        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve([200, response2])
            }, 800)
        })
    }
    if (prompt == 'Định dạng câu hỏi mà tui nên hỏi như nào để tăng độ chính xác khi hỏi') {
        const response2 = {
            id: uniqueId('ai-conversation-'),
            choices: [
                {
                    finish_reason: 'stop',
                    index: 0,
                    message: {
                        content: `Một số cách để bạn có thể tăng độ chính xác câu trả lời:

- **Viết đúng chính tả:** Việc viết đúng thời gian và tên nhà cung cấp sẽ giúp mô hình trả về kết quả chính xác hơn
- **Định dạng thời gian nhập:** Nhập đủ thông tin ngày, tháng và năm (YYYY-MM-DD)
- **Khoảng thời gian:** Nên tra cứu trong khoảng thời gian từ 10 ngày trở xuống


                        
                
                        `,
                        role: 'assistant',
                    },
                },
            ],
            created: dayjs().unix(),
            model: 'gpt-4',
        }

        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve([200, response2])
            }, 800)
        })
    }

    try {

        var role = localStorage.getItem("role")
        if (role) {
            role = CryptoJS.AES.decrypt(role, secretKey).toString(CryptoJS.enc.Utf8);
        }
        if (role !== 'admin' && role !== 'users') {
            const response2 = {
                id: uniqueId('ai-conversation-'),
                choices: [
                    {
                        finish_reason: 'stop',
                        index: 0,
                        message: {
                            content: 'Bạn chưa đăng kí gói hoặc gói đã hết hạn, vui lòng đăng kí để sử dụng dịch vụ của chúng tôi.',
                            role: 'assistant',
                        },
                    },
                ],
                created: dayjs().unix(),
                model: 'gpt-4',
            }

            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve([200, response2])
                }, 800)
            })
        }


        var userid = localStorage.getItem("userid")
        if (userid) {
            userid = CryptoJS.AES.decrypt(userid, secretKey).toString(CryptoJS.enc.Utf8);
        }

        const token = localStorage.getItem("token")

        // console.log("userid", userid )

        const response_pack = await axios.post(`${API_BASE_URL}/packages/get-package-infor`,
            { id: userid },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        // console.log(response_pack.data)
        const packages = response_pack.data
        const sortedPackages = packages.sort((a: Package, b: Package) => {
            return priorityOrder[a.id_package] - priorityOrder[b.id_package];
        });

        const highestPriorityPackage = sortedPackages[0];

        // console.log("Gói ưu tiên nhất:", highestPriorityPackage.id_package
        // );

        // const response = await axios.post(`${API_BASE_URL}/model/chat`,
        //     {
        //         prompt: prompt,
        //         package: highestPriorityPackage.id_package
        //     },
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // )
        //  if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // console.log(response.response)

        // const response = await fetch(`${API_BASE_URL_MODEL}/api/chat`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ prompt: prompt, package: highestPriorityPackage.id_package }),
        //     credentials: 'include',
        // });

        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // if (response) {
        //     console.log(response)
        // }
        // const responseData = await response.json();
        // const responseData2 = String(responseData.response)

        const response2 = {
            id: uniqueId('ai-conversation-'),
            choices: [
                {
                    finish_reason: 'stop',
                    index: 0,
                    message: {
                        // content: responseData2,
                        content:
                            `Đây chỉ là bản demo, tính năng chat không hỗ trợ.`,
                        //                     content: `

                        // `,
                        role: 'assistant',
                    },
                },
            ],
            created: dayjs().unix(),
            model: 'gpt-4',
        }

        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve([200, response2])
            }, 800)
        })
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }

})




