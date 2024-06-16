import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider } from '../providers/JwtProvider'
import { env } from '~/config/environment'

const MOCK_DATABASE = {
  USER: {
    ID: 'minatisleeping-sample-id-12345678',
    EMAIL: 'minatt2002@gmail.com',
    PASSWORD: 'Minatisleeping123!'
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
const ACCESS_SECRET_SIGNATURE = env.ACCESS_TOKEN_SECRET_SIGNATURE
const REFRESH_SECRET_SIGNATURE = env.REFRESH_TOKEN_SECRET_SIGNATURE

const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // Tạo thông tin payload để đính kèm trong JWT Token: bao gồm id và email của user
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL
    }

    // Tạo Access Token
    const accessToken = await JwtProvider.signToken(userInfo, ACCESS_SECRET_SIGNATURE, ms('15m'))

    // Tạo Refresh Token
    const refreshToken = await JwtProvider.signToken(userInfo, REFRESH_SECRET_SIGNATURE, ms('30d'))

    /**
     * Xử lý trường hợp trả về http only cookie cho phía trình duyệt
     * Đối với cái maxAge - thời gian sống của Cookie thì chúng ta sẽ để tối đa 14 ngày, tuỳ project.
    */
    //! Lưu ý: Thời gian sống của Cookie khác với cái thời gian sống của token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Trả về thông tin user cũng như sẽ trả về Token cho trường hợp phía FE cần lưu Token vào LocalStorage
    res.status(StatusCodes.OK).json({ ...userInfo, accessToken, refreshToken })

    // res.status(StatusCodes.OK).json({ message: 'Login API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: ' Refresh Token API success.' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
