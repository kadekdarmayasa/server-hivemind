import { Request, Response, NextFunction } from 'express';
import '../types/express.session';

const isLogin = (req: Request, res: Response, next: NextFunction): void => {
  req.session.user ? next() : res.redirect('/auth/signin');
};

export default isLogin;
