import express from 'express'
import { body } from 'express-validator'
import SubscriberController from '../controllers/subscriber.controller'
import auth from '../middlewares/auth.middleware'

export const subscriberRouter = express.Router()

subscriberRouter.use(auth)
subscriberRouter.get('/', SubscriberController.index)
subscriberRouter.post(
  '/',
  body('email').trim(),
  SubscriberController.addSubscriber
)
subscriberRouter.put(
  '/:id',
  body('email').trim(),
  SubscriberController.updateSubscriber
)
subscriberRouter.delete('/:id', SubscriberController.deleteSubscriber)
