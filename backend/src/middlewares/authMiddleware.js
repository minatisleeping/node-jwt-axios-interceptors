/* eslint-disable no-console */
import { MESSAGES } from '~/config/messages'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

/*  Middleware này sẽ đảm nhiệm việc quan trọng: Lấy và xác thực cái jwt accessToken nahn65 được từ phía
  FE có hợp lệ hay không
*/
const isAuthorized = async (req, res, next) => {
  //*   Cách 1: Lấy accessToken nằm trong req Cookies phía Client - withCredentials trong file
//* authorizeAxios và credentials trong CORS
  const accessTokenFromCookie = req.cookies?.accessToken
  console.log('🚀 ~ accessTokenFromCookie:', accessTokenFromCookie)
  console.log('---')
  if (!accessTokenFromCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED })
  }

  //*   Cách 2: Lấy accessToken trong case phía FE lưu localStorage và gửi lên thông qua header authorization
  const accessTokenFromHeader = req.headers.authorization
  if (!accessTokenFromHeader) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED })
  }

  try {
    // Bước 1: Thực hiện giải mã token xem nó có hợp lệ hay không
    const decodedAccessToken = await JwtProvider.verifyToken(
      // accessTokenFromCookie,
      accessTokenFromHeader.substring('Bearer '.length),
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    // Bước 2: Nếu như cái token hợp lệ, thì cần phải lưu thông tin giải mã được vào cái req.jwtDecoded,
    // để sử dụng cho các tầng cần xử lí phỉa sau
    req.jwtDecoded = decodedAccessToken

    // Bước 3: Cho phép cái req đi típ :)))
    next()
  } catch (error) {
    console.log('Error from authMiddleware ', authMiddleware)
    //! Case 01: Nếu accessToken hết hạn thì mình cần trả về mã lỗi GONE - 410 cho FE biết
    //để gọi API refresh token
    if (error.message?.includes('jwt expired')) {
      return res.status(StatusCodes.GONE).json({ message: MESSAGES.TOKEN_EXPIRED })
    }

    //! Case 02: Nếu accessToken không hợp lệ do bất kì lý do gì khác token hết hạn thì mình
    //cứ thẳng tay trả về mã UNAUTHORIZED - 401 cho FE  xử lí Logout or call api Logout tuỳ case
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED_LOGIN })
  }
}

export const authMiddleware = {
  isAuthorized
}
