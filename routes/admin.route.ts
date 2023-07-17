import express from 'express';
import { body } from 'express-validator';
import AdminController from '../controllers/admin.controller';
import auth from '../middlewares/auth.middleware';

export const adminRouter = express.Router();

adminRouter.use(auth);
adminRouter.get('/', AdminController.index);
adminRouter.get('/dashboard', AdminController.dashboard);
adminRouter.get('/subscribers', AdminController.subscribers);
adminRouter.post('/subscribers', body('email').trim(), AdminController.addSubscriber);
adminRouter.put('/subscribers', body('email').trim(), AdminController.updateSubscriber);
adminRouter.delete('/subscribers/:id', AdminController.deleteSubscriber);
