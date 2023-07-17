import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import SubscriberModel from '../models/subscriber.model';
import '../types/express.session';

class AdminController {
  static async index(req: Request, res: Response) {
    res.redirect('/admin/dashboard');
  }

  static async dashboard(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('admin/dashboard', {
      title: 'Dashboard',
      view: 'dashboard',
      user,
    });
  }

  static async subscribers(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const subscribers = await SubscriberModel.getAllSubscribers();

    res.render('admin/subscribers', {
      title: 'Hivemind | Subscribers',
      view: 'subscriber',
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
      user,
      subscribers,
    });
  }

  static async addSubscriber(req: Request, res: Response) {
    try {
      const subscriber = await SubscriberModel.getSubscriberByEmail(req.body.email);
      if (subscriber) throw new Error('Subscriber already exists');

      await SubscriberModel.addSubscriber(req.body.email);

      req.flash('alertMessage', 'Subscriber added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/subscribers');
  }

  static async updateSubscriber(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id as string, 10);
      const email = req.body.email;

      await SubscriberModel.updateSubscriber(id, email);

      req.flash('alertMessage', 'Subscriber updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/subscribers');
  }

  static async deleteSubscriber(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const subscriber = await SubscriberModel.deleteSubscriber(id);
      if (!subscriber) throw new Error('Subscriber not found');

      req.flash('alertMessage', 'Subscriber deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/subscribers');
  }
}

export default AdminController;
