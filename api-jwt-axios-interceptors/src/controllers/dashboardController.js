import { StatusCodes } from 'http-status-codes'

const access = async (req, res) => {
  try {
    const userInfo = {
      id: req.jwtDecoded.id,
      email: req.jwtDecoded.email
    }

    return res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const dashboardController = {
  access
}
