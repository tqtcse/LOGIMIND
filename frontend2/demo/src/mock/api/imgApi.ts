import { mock } from '../MockAdapter'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


mock.onPost(`/api/delete/avatar`).reply(async (config) => {
    try {
        const token = localStorage.getItem("token")
        const requestData = JSON.parse(config.data);
        const email = requestData.email;
        const response = await axios.delete(`${API_BASE_URL}/image/deleteImage/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )

        return [200, response];
    } catch (error) {
        return [500, { error: 'Xóa không thành công' }];
    }
});
