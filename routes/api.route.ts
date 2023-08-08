import express from 'express';
import ApiController from '../controllers/api.controller';

export const apiRouter = express.Router();

apiRouter.get('/homepage', ApiController.homepage);
apiRouter.get('/image/:name', ApiController.getImage);
apiRouter.get('/blogs', ApiController.getBlogs);
apiRouter.get('/blog/:id', ApiController.getBlog);
