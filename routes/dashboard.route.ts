import express from 'express'
import DashboardController from '../controllers/dashboard.controller'
import auth from '../middlewares/auth.middleware'

export const dashboardRouter = express.Router()

dashboardRouter.use(auth)
dashboardRouter.get('/', DashboardController.index)
