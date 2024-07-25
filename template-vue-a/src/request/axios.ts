import axios from 'axios'

export const instance = axios.create({
  baseURL: '',
  // timeout: 20000,
  // withCredentials: true,
})

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    //
    return config
  },
  (error) => {
    //
    return Promise.reject(error)
  },
)

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    //
    return response
  },
  (error) => {
    //
    return Promise.reject(error)
  },
)
