import ApiService from './ApiService'

export async function apiGetEcommerceDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/dashboard/ecommerce',
        method: 'get',
    })
}

export async function apiGetEcommerceDashboard2<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/dashboard/ecommerce2',
        method: 'get',
    })
}
