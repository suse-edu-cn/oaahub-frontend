import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
})

const request = async function <T>(config: {
    url: string
    method?: 'GET' | 'POST'
    data?: any
    params?: any
    token?: string
}): Promise<T> {
    try {
        // 从 store 中获取 token，如果调用时没提供 token 就用这个
        let token = ''
        try {
            const authStore = useAuthStore()
            token = authStore.token || ''
        } catch (e) {}
        // 创建请求
        const response = await instance.request<T>({
            url: config.url,
            method: config.method || 'GET',
            data: config.data || {},
            params: config.params || {},
            headers: {
                Authorization: config.token || token,
            },
        })
        return response.data
    } catch (error: any) {
        return error.response?.data
    }
}

export default request
