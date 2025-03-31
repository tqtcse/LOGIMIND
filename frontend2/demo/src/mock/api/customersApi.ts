/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'

import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type User = {
    id: string;
    username: string;
    password: string;
    fullname: string;
    email: string;
    address: string;
    company: string;
    created_datetime: string;
    updated_datetime: string;
    rule: number;
};


mock.onGet(`/api/customers`).reply(async (config) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    const { pageIndex, pageSize, sort, query } = config.params


    const users = response.data as any[]


    const sanitizeUsers = users.filter((elm) => typeof elm !== 'function')
    let data = sanitizeUsers

    let total = users.length

    let total2 = response.data.length

    if (query) {
        data = wildCardSearch(data, query)
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)


    const responseData = {
        list: data,
        total: total,
    }
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(new RegExp(`/api/customers/*`)).reply(async function (config) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    const id = config.url?.split('/')[2]

    const usersList: User[] = response.data

    const user = usersList.find((user) => user.id === id)

    if (!user) {
        return [404, {}]
    }

    return [200, user]
})


