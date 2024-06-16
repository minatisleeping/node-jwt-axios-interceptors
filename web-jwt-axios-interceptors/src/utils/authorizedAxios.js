import axios from 'axios'
import { toast } from 'react-toastify'

// Khởi tạo 1 đối tượng axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// Thời gian tối đa của 1 request là 10'
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE(phục vụ
//trường hợp nếu chúng ta lưu jwt tokens(access & refresh)) theo cơ chế httpOnly Cookie )
// authorizedAxiosInstance.defaults.withCredentials = true

//! Cấu hình Interceptors (Bộ đánh chặn vào mỗi Request và Response)
//* Add a request interceptor: Can thiệp vào giữa các request API
authorizedAxiosInstance.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

//* Add a response interceptor: Can thiệp vào giữa các response API
authorizedAxiosInstance.interceptors.response.use(response => {

  return response
}, error => {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ error:', error)

  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance
