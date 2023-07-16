import express, { Request, Response } from 'express';
import AdminController from '../controllers/AdminController';
import auth from '../middlewares/auth';

export const adminRouter = express.Router();

adminRouter.use(auth);
adminRouter.get('/', AdminController.index);
adminRouter.get('/dashboard', AdminController.dashboard);
