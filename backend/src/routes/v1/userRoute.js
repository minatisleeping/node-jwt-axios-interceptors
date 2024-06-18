import express from 'express'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/login')
  .post(userController.login)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .put(userController.refreshToken)

export const userRoute = Router
