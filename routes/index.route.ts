import express, { Request, Response } from 'express';
import '../types/express.session';

export const indexRouter = express.Router();

indexRouter.get('/', function (req: Request, res: Response) {
  if (req.session.user) {
    res.redirect(req.session.user.roleId === 1 ? '/admin' : '/user');
  }

  res.redirect('/auth/signin');
});
