import express from 'express';
import ApiController from '../controllers/api.controller';

export const apiRouter = express.Router();

apiRouter.get('/homepage', ApiController.homepage);
apiRouter.get('/image/:name', ApiController.getImage);
apiRouter.get('/blogs', ApiController.getBlogs);
apiRouter.get('/blog/:id', ApiController.getBlog);
apiRouter.get('/faqs', ApiController.faqs);
apiRouter.post('/portfolios', ApiController.portfolios);
apiRouter.get('/teams', ApiController.teams);
apiRouter.post('/subscriber', ApiController.subscriber);
