import express from 'express'
import PortfolioController from '../controllers/portfolio.controller'
import { body } from 'express-validator'
import { processUpload } from '../middlewares/upload.middleware'
import * as multer from '../middlewares/multer.middleware'
import auth from '../middlewares/auth.middleware'

export const portfolioRouter = express.Router()

portfolioRouter.use(auth)
portfolioRouter.get('/', PortfolioController.index)
portfolioRouter.post(
  '/',
  body('portfolioName').trim(),
  body('orientation').trim(),
  body('serviceId').isInt(),
  processUpload(multer.upload.single('portfolioThumbnail'), '/portfolios'),
  PortfolioController.addPortfolio
)
portfolioRouter.put(
  '/:id',
  body('portfolioName').trim(),
  body('orientation').trim(),
  body('serviceId').isInt(),
  processUpload(multer.upload.single('portfolioThumbnail'), '/portfolios'),
  PortfolioController.updatePortfolio
)
portfolioRouter.delete('/:id', PortfolioController.deletePortfolio)
