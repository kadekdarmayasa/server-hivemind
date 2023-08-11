import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import '../types/express.session';
import { db } from '../lib/server.db';

class AuthController {
  static async viewSignin(req: Request, res: Response) {
    if (req.session.user) {
      return res.redirect('/user');
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
    const user = await db.user.findFirst({
      where: { username },
    });

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

    res.redirect('/user');
  }

  static async actionSignout(req: Request, res: Response) {
    req.session.destroy(() => res.redirect('/auth/signin'));
  }
}

export default AuthController;
