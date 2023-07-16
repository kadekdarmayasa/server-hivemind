import express, { Request, Response } from 'express';

export const indexRouter = express.Router();

indexRouter.get('/', function (req: Request, res: Response) {
  if (req.session.user) {
    const { name, roleId } = req.session.user;

    if (name !== undefined && roleId === 1) {
      return res.redirect('/admin');
    }

    res.redirect('/user');
  }

  res.redirect('/auth/signin');
});
