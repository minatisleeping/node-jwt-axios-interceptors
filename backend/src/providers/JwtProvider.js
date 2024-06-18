import JWT from 'jsonwebtoken'

const signToken = async (userInfo, secretSignature, expiredToken) => {
  try {
    // hàm sign() của thư viện Jwt - Thuật toán mặc định là HS256, cho vào để nhớ
    return JWT.sign(userInfo, secretSignature, { algorithm:'HS256', expiresIn: expiredToken })
  } catch (error) { throw new Error(error) }
}

/**
 ** Function kiểm trả 1 token có hợp lệ hay không
** Hợp lệ ở đây hiểu đơn giản là cái token được tạo ra có đúng với cái chữ ký bí mật secretSignature trong project hay k
 */
const verifyToken = async (token, secretSignature) => {
  try {
    // Do something
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  signToken,
  verifyToken
}
