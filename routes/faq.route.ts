import express from 'express'
import { body } from 'express-validator'
import FAQController from '../controllers/faq.controller'
import auth from '../middlewares/auth.middleware'

export const faqRouter = express.Router()

faqRouter.use(auth)
faqRouter.get('/', FAQController.index)
faqRouter.post(
  '/',
  body('question').trim(),
  body('answer').trim(),
  FAQController.addFAQ
)
faqRouter.put(
  '/:id',
  body('question').trim(),
  body('answer').trim(),
  FAQController.updateFAQ
)
faqRouter.delete('/:id', FAQController.deleteFAQ)
