import express from 'express';
import ApiController from '../controllers/api.controller';

export const apiRouter = express.Router();

apiRouter.get('/homepage', ApiController.homepage);
apiRouter.get('/image/:filename', ApiController.getImage);
apiRouter.get('/services', ApiController.services);
apiRouter.post('/blogs', ApiController.blogs);
apiRouter.get('/blogs/:slug', ApiController.getBlog);
apiRouter.get('/faqs', ApiController.faqs);
apiRouter.post('/portfolios', ApiController.portfolios);
apiRouter.get('/teams', ApiController.teams);
apiRouter.post('/subscribers', ApiController.addSubscriber);
apiRouter.get('/subscribers', ApiController.getSubscribers);
