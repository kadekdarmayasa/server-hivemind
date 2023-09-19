import express from 'express'
import { body } from 'express-validator'
import ClientController from '../controllers/client.controller'
import auth from '../middlewares/auth.middleware'
import { processUpload } from '../middlewares/upload.middleware'
import * as multer from '../middlewares/multer.middleware'

export const clientRouter = express.Router()

clientRouter.use(auth)
clientRouter.get('/', ClientController.index)
clientRouter.post(
  '/',
  body('clientName').trim(),
  processUpload(multer.upload.single('clientLogo'), '/clients'),
  ClientController.addClient
)
clientRouter.put(
  '/:id',
  body('clientName').trim(),
  processUpload(multer.upload.single('clientLogo'), '/clients'),
  ClientController.updateClient
)
clientRouter.delete('/:id', ClientController.deleteClient)
