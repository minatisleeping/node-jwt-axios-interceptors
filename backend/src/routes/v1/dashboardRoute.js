import express from 'express'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/access')
  .get(authMiddleware.isAuthorized, dashboardController.access)

export const dashboardRoute = Router
