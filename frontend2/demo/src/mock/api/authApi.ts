import { mock } from '../MockAdapter'
import axios from 'axios'
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const secretKeyWordArray = CryptoJS.enc.Utf8.parse(secretKey);
mock.onPost(`/sign-in`).reply(async (config) => {

    try {

        const data = JSON.parse(config.data as string) as {
            email: string;
            password: string;
        };

        const { email, password } = data;
        console.log(API_BASE_URL)
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', CryptoJS.AES.encrypt(email, secretKey).toString())
            const user = { email };
            const token = response.data.token;
            localStorage.setItem("token", token)
            const response2 = await axios.post(
                `${API_BASE_URL}/user/get-user-infor`,
                { email },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            var role = 'user'
            if (response2.data.rule == 0) {

                role = CryptoJS.AES.encrypt('admin', secretKey).toString()
            }

            return [
                201,
                {
                    user,
                    token: response.data.token,
                    role: role
                },
            ];
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
    }

    return [401, { message: 'Invalid email or password!' }];
})

mock.onPost(`/sign-up`).reply(async (config) => {
    try {
        const data = JSON.parse(config.data as string) as {
            email: string
            password: string
            userName: string
        }

        const { email, userName, password } = data

        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            username: userName,
            email,
            password,
            confirmPassword: password,
        });

        // console.log(response.data)

        localStorage.setItem('email', CryptoJS.AES.encrypt(email, secretKey).toString())
        localStorage.setItem('role', CryptoJS.AES.encrypt('user', secretKey).toString())
        // const emailUsed = signInUserData.some((user) => user.email === email)
        const response2 = await axios.post(`${API_BASE_URL}/user/get-user-id?`, { email },

            {
                headers: { Authorization: `Bearer ${response.data.token}` },
            },


        )


        const now = new Date();
        now.setDate(now.getDate() + 7);
        const expired_datetime = now.toISOString().slice(0, 19).replace("T", " ");

        const response3 = await axios.post(
            `${API_BASE_URL}/order/add-order-detail`,
            {
                id_account: response2.data.id,
                id_package: 'trial_package',
                expired_datetime: expired_datetime,
            },
            { headers: { Authorization: `Bearer ${response.data.token}` } }
        );




        const newUser = {
            avatar: '/img/avatars/thumb-1.jpg',
            userName,
            email,
            authority: ['user'],
        }

        return new Promise(function (resolve) {
            setTimeout(function () {


                resolve([
                    201,
                    {
                        user: newUser,
                        token: response.data.token,
                    },
                ])
            }, 800)
        })
    } catch (err) {
        console.log(err)
    }
    return [401, { message: 'Invalid email or password!' }];
})


mock.onPost(`/sign-out`).reply(() => {
    return [200, true]
})
