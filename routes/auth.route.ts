import express from 'express'
import { body } from 'express-validator'
import AuthController from '../controllers/auth.controller'

export const authRouter = express.Router()

authRouter.get('/signin', AuthController.viewSignin)
authRouter.post(
  '/signin',
  body('username').isString().trim(),
  body('password').isString().trim(),
  AuthController.actionSignin
)
authRouter.get('/signout', AuthController.actionSignout)
