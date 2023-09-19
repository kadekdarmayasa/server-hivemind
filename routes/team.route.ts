import express from 'express'
import { body } from 'express-validator'
import { processUpload } from '../middlewares/upload.middleware'
import * as multer from '../middlewares/multer.middleware'
import auth from '../middlewares/auth.middleware'
import TeamController from '../controllers/team.controller'

export const teamRouter = express.Router()

teamRouter.use(auth)
teamRouter.get('/', TeamController.index)
teamRouter.post(
  '/',
  body('name').trim(),
  body('username').trim(),
  body('password').trim(),
  body('linkedin').trim(),
  processUpload(multer.upload.single('teamPhoto'), '/teams'),
  TeamController.addTeam
)
teamRouter.put(
  '/:id',
  body('name').trim(),
  body('name').trim(),
  body('username').trim(),
  body('password').trim(),
  body('linkedin').trim(),
  processUpload(multer.upload.single('teamPhoto'), '/teams'),
  TeamController.updateTeam
)
teamRouter.delete('/:id', TeamController.deleteTeam)
