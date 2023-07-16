import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';
import '../types/express.session';

class AuthController {
  static async viewSignin(req: Request, res: Response) {
    if (req.session.user) {
      res.redirect(req.session.user!.roleId === 1 ? '/admin/dashboard' : '/user/dashboard');
    }

    res.render('auth/signin', {
      title: 'Hivemind | Sign In',
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    });
  }

  static async actionSignin(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await UserModel.getUserByUsername(username);

    if (!user) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', 'User could not be found');
      return res.redirect('/auth/signin');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', 'Password is incorrect');
      return res.redirect('/auth/signin');
    }

    req.session.user = {
      id: user.id,
      roleId: user.roleId,
    };

    res.redirect(user.roleId === 1 ? '/admin' : '/user');
  }

  static async actionSignout(req: Request, res: Response) {
    req.session.destroy(() => res.redirect('/auth/signin'));
  }
}

export default AuthController;
