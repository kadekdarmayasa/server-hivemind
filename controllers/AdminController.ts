import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import '../types/express.session';

class AdminController {
  static async index(req: Request, res: Response) {
    res.redirect('/admin/dashboard');
  }

  static async dashboard(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('admin/dashboard', {
      title: 'Dashboard',
      user: user,
    });
  }
}

export default AdminController;
