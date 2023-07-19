import express from 'express';
import { body } from 'express-validator';
import AdminController from '../controllers/admin.controller';
import auth from '../middlewares/auth.middleware';
import * as multer from '../middlewares/multer.middleware';
import { processUpload } from '../middlewares/upload.middleware';

export const adminRouter = express.Router();

adminRouter.use(auth);

adminRouter.get('/', AdminController.index);
adminRouter.get('/dashboard', AdminController.dashboard);

adminRouter.get('/subscribers', AdminController.subscribers);
adminRouter.post('/subscribers', body('email').trim(), AdminController.addSubscriber);
adminRouter.put('/subscribers', body('email').trim(), AdminController.updateSubscriber);
adminRouter.delete('/subscribers/:id', AdminController.deleteSubscriber);

adminRouter.get('/faqs', AdminController.faqs);
adminRouter.post('/faqs', body('question').trim(), body('answer').trim(), AdminController.addFAQ);
adminRouter.put('/faqs', body('question').trim(), body('answer').trim(), AdminController.updateFAQ);
adminRouter.delete('/faqs/:id', AdminController.deleteFAQ);

adminRouter.get('/clients', AdminController.clients);
adminRouter.post(
  '/clients',
  body('clientName').trim(),
  processUpload(multer.upload.single('clientLogo'), '/admin/clients'),
  AdminController.addClient,
);
adminRouter.delete('/clients/:id', AdminController.deleteClient);

adminRouter.get('/testimonies', AdminController.testimonies);
adminRouter.post(
  '/testimonies',
  body('clientName').trim(),
  body('occupation').trim(),
  body('message').trim(),
  body('rate'),
  processUpload(multer.upload.single('clientPhoto'), '/admin/testimonies'),
  AdminController.addTestimony,
);
adminRouter.put(
  '/testimonies',
  body('clientName').trim(),
  body('occupation').trim(),
  body('message').trim(),
  body('rate'),
  processUpload(multer.upload.single('clientPhoto'), '/admin/testimonies'),
  AdminController.updateTestimony,
);
adminRouter.delete('/testimonies/:id', AdminController.deleteTestimony);
