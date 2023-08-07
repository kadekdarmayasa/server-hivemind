import createError from 'http-errors';
import CustomError from '../types/custom.error';
import express, { NextFunction, Request, Response } from 'express';

export const errorRouter = express.Router();

errorRouter.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

errorRouter.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.render('error', { error: err, title: `${err.status} | ${err.message}` });
});
