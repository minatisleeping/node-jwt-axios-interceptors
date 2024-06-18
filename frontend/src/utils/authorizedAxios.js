import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

// Khởi tạo 1 đối tượng axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian tối đa của 1 request là 10'
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE(phục vụ
//trường hợp nếu chúng ta lưu jwt tokens(access & refresh)) theo cơ chế httpOnly Cookie )
authorizedAxiosInstance.defaults.withCredentials = true

//! Cấu hình Interceptors (Bộ đánh chặn vào mỗi Request và Response)
//* Add a request interceptor: Can thiệp vào giữa các request API
authorizedAxiosInstance.interceptors.request.use(config => {
  // Lấy accessToken từ localStorage và đính kèm vào header
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}, error => { return Promise.reject(error) })

// Khởi tạo 1 cái Promise cho việc gọi API refresh token
// Mục đích tạo Promise này để khi nhận yêu cầu refreshToken đầu tiên thì hold lại việc gọi API refresh_token
//cho đến khi nó resolve xong thì mới retry lại những API bị lỗi trước đó thay vì cứ thế gọi lại refreshTokenAPI
//liên tục với mỗi request lỗi
let refreshTokenPromise = null

//* Add a response interceptor: Can thiệp vào giữa các response API
authorizedAxiosInstance.interceptors.response.use(response => {
  return response
}, error => {
  //! Khu vực quan trọng: Xử lý refresh token tự động
  // Nếu như nhận mã 401 từ BE, thì gọi API Logout luôn
  if (error.response?.status === 401) {
    handleLogoutAPI().then(() => {
      // Nếu trường hợp dùng Cookie thì nhớ xoá userInfo trong localStorage
      // localStorage.removeItem('userInfo')

      // Điều hướng tới trang Login khi logout thành công
      location.href = '/login' // js thuần
    })
  }

  // Nếu như nhận mã 410 từ BE, thì sẽ gọi API refresh token để làm mới lại accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequest = error.config
  // console.log('🚀 ~ originalRequest:', originalRequest)

  if (error.response?.status === 410 && originalRequest) {
    if (!refreshTokenPromise) {
      // Lấy refreshToken từ localStorage (in case localStorage)
      const refreshToken = localStorage.getItem('refreshToken')
      // Gọi API refresh token
      refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then(res => {
          // Lấy và gán lại accessToken vào localStorage (in case localStorage)
          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}abcxyz`

          // Đồng thời lưu ý là accessToken cũng đã được update lại ở Cookie rồi (in case Cookie)
          // ...
          return authorizedAxiosInstance(originalRequest)
        })
        .catch(_error => {
          // Nếu nhận bất cứ lỗi nào từ API refresh token thì cứ Logout luôn
          handleLogoutAPI().then(() => {
            // Nếu trường hợp dùng Cookie thì nhớ xoá userInfo trong localStorage
            // localStorage.removeItem('userInfo')

            // Điều hướng tới trang Login khi logout thành công
            location.href = '/login' // js thuần
          })
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API refresh_token có thành công hay lỗi thì vẫn gán lại refreshTokenPromise về null như ban đầu
          refreshTokenPromise = null
        })
    }

    // Cuối cùng mới return cá refreshTokenPromise trong trường hợp success ở đây
    return refreshTokenPromise.then(() => {
      // Quan trọng: return lại axios instance của ta kết hợp cái originalRequest để gọi lại những API ban đầu lỗi
      return authorizedAxiosInstance(originalRequest)
    })
  }

  // Xử lý tâp trung phần hiển thị thông báo lỗi trả về từ mọi API
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance
