import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/user.controller';
import auth from '../middlewares/auth.middleware';
import * as multer from '../middlewares/multer.middleware';
import { processUpload } from '../middlewares/upload.middleware';

export const userRouter = express.Router();

userRouter.use(auth);

userRouter.get('/', UserController.index);
userRouter.get('/dashboard', UserController.dashboard);

userRouter.get('/profile', UserController.profile);
userRouter.put(
  '/profile',
  body('name').trim(),
  body('username').trim(),
  body('email').trim(),
  body('linkedin').trim(),
  UserController.updateProfile,
);
userRouter.put(
  '/update-photo',
  processUpload(multer.upload.single('photo'), '/user/profile'),
  UserController.updatePhotoProfile,
);
userRouter.put(
  '/update-password',
  body('id'),
  body('newPassword').trim(),
  body('currentPassword').trim(),
  UserController.updatePassword,
);

userRouter.get('/subscribers', UserController.subscribers);
userRouter.post('/subscribers', body('email').trim(), UserController.addSubscriber);
userRouter.put('/subscribers', body('email').trim(), UserController.updateSubscriber);
userRouter.delete('/subscribers/:id', UserController.deleteSubscriber);

userRouter.get('/faqs', UserController.faqs);
userRouter.post('/faqs', body('question').trim(), body('answer').trim(), UserController.addFAQ);
userRouter.put('/faqs', body('question').trim(), body('answer').trim(), UserController.updateFAQ);
userRouter.delete('/faqs/:id', UserController.deleteFAQ);

userRouter.get('/clients', UserController.clients);
userRouter.post(
  '/clients',
  body('clientName').trim(),
  processUpload(multer.upload.single('clientLogo'), '/user/clients'),
  UserController.addClient,
);
userRouter.delete('/clients/:id', UserController.deleteClient);

userRouter.get('/testimonies', UserController.testimonies);
userRouter.post(
  '/testimonies',
  body('clientName').trim(),
  body('occupation').trim(),
  body('message').trim(),
  body('rate'),
  processUpload(multer.upload.single('clientPhoto'), '/user/testimonies'),
  UserController.addTestimony,
);
userRouter.put(
  '/testimonies',
  body('clientName').trim(),
  body('occupation').trim(),
  body('message').trim(),
  body('rate'),
  processUpload(multer.upload.single('clientPhoto'), '/user/testimonies'),
  UserController.updateTestimony,
);
userRouter.delete('/testimonies/:id', UserController.deleteTestimony);

userRouter.get('/services', UserController.services);
userRouter.post(
  '/services',
  body('serviceName').trim(),
  body('description').trim(),
  processUpload(multer.upload.single('thumbnail'), '/user/services'),
  UserController.addService,
);
userRouter.put(
  '/services',
  body('serviceName').trim(),
  body('description').trim(),
  processUpload(multer.upload.single('thumbnail'), '/user/services'),
  UserController.updateService,
);
userRouter.delete('/services/:id', UserController.deleteService);

userRouter.get('/portfolios', UserController.portfolios);
userRouter.post(
  '/portfolios',
  body('portfolioName').trim(),
  body('orientation').trim(),
  body('serviceId').isInt(),
  processUpload(multer.upload.single('thumbnail'), '/user/portfolios'),
  UserController.addPortfolio,
);
userRouter.put(
  '/portfolios',
  body('portfolioName').trim(),
  body('orientation').trim(),
  body('serviceId').isInt(),
  processUpload(multer.upload.single('thumbnail'), '/user/portfolios'),
  UserController.updatePortfolio,
);
userRouter.delete('/portfolios/:id', UserController.deletePortfolio);

userRouter.get('/teams', UserController.teams);
userRouter.post(
  '/teams',
  body('name').trim(),
  body('username').trim(),
  body('password').trim(),
  body('linkedin').trim(),
  processUpload(multer.upload.single('photo'), '/user/team'),
  UserController.addTeam,
);
userRouter.put(
  '/teams',
  body('name').trim(),

  body('name').trim(),
  body('username').trim(),
  body('password').trim(),
  body('linkedin').trim(),
  processUpload(multer.upload.single('photo'), '/user/team'),
  UserController.updateTeam,
);
userRouter.delete('/teams/:id', UserController.deleteTeam);
