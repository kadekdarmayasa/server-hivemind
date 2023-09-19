import express from 'express'
import { body } from 'express-validator'
import UserController from '../controllers/user.controller'
import auth from '../middlewares/auth.middleware'
import * as multer from '../middlewares/multer.middleware'
import { processUpload } from '../middlewares/upload.middleware'

export const userRouter = express.Router()

userRouter.use(auth)
userRouter.get('/profile', UserController.index)
userRouter.put(
  '/profile',
  body('name').trim(),
  body('username').trim(),
  body('email').trim(),
  body('linkedin').trim(),
  UserController.updateProfile
)
userRouter.put(
  '/update-photo',
  processUpload(multer.upload.single('photo'), '/user/profile'),
  UserController.updatePhotoProfile
)
userRouter.put(
  '/update-password',
  body('id'),
  body('newPassword').trim(),
  body('currentPassword').trim(),
  UserController.updatePassword
)
