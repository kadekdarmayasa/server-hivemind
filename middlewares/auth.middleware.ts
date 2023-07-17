import { Request, Response, NextFunction } from 'express';

const isLogin = (req: Request, res: Response, next: NextFunction): void => {
  req.session.user ? next() : res.redirect('/auth/signin');
};

export default isLogin;
