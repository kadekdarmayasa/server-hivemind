import express from 'express'
import { body } from 'express-validator'
import TestimonyController from '../controllers/testimony.controller'
import auth from '../middlewares/auth.middleware'
import { processUpload } from '../middlewares/upload.middleware'
import * as multer from '../middlewares/multer.middleware'

export const testimonyRouter = express.Router()

testimonyRouter.use(auth)
testimonyRouter.get('/', TestimonyController.index)
testimonyRouter.post(
  '/',
  body('clientName').trim(),
  body('occupation').trim(),
  body('message').trim(),
  body('rate'),
  processUpload(multer.upload.single('clientPhoto'), '/testimonies'),
  TestimonyController.addTestimony
)
testimonyRouter.put(
  '/:id',
  body('clientName').trim(),
  body('occupation').trim(),
  body('message').trim(),
  body('rate'),
  processUpload(multer.upload.single('clientPhoto'), '/testimonies'),
  TestimonyController.updateTestimony
)
testimonyRouter.delete('/:id', TestimonyController.deleteTestimony)
