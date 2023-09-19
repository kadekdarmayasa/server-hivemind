import express from 'express'
import { body } from 'express-validator'
import { processUpload } from '../middlewares/upload.middleware'
import * as multer from '../middlewares/multer.middleware'
import auth from '../middlewares/auth.middleware'
import ServiceController from '../controllers/service.controller'

export const serviceRouter = express.Router()

serviceRouter.use(auth)
serviceRouter.get('/', ServiceController.index)
serviceRouter.post(
  '/',
  body('serviceName').trim(),
  body('description').trim(),
  processUpload(multer.upload.single('thumbnail'), '/services'),
  ServiceController.addService
)
serviceRouter.put(
  '/:id',
  body('serviceName').trim(),
  body('description').trim(),
  processUpload(multer.upload.single('thumbnail'), '/services'),
  ServiceController.updateService
)
serviceRouter.delete('/:id', ServiceController.deleteService)
