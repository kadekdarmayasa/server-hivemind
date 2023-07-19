import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import SubscriberModel from '../models/subscriber.model';
import FAQModel from '../models/faq.model';
import ClientModel from '../models/client.model';
import TestimonyModel from '../models/testimony.model';
import ServiceModel from '../models/service.model';
import { unlink } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import '../types/express.session';

class AdminController {
  static async index(req: Request, res: Response) {
    res.redirect('/admin/dashboard');
  }

  static async dashboard(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('admin/dashboard', {
      title: 'Hivemind | Dashboard',
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

  static async faqs(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const faqs = await FAQModel.getAllFAQs();

    res.render('admin/faqs', {
      title: 'Hivemind | FAQs',
      view: 'faq',
      faqs,
      user,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async addFAQ(req: Request, res: Response) {
    try {
      await FAQModel.addFAQ({
        question: req.body.question,
        answer: req.body.answer,
      });

      req.flash('alertMessage', 'FAQ added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/faqs');
  }

  static async deleteFAQ(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await FAQModel.deleteFAQ(id);

      req.flash('alertMessage', 'FAQ deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/faqs');
  }

  static async updateFAQ(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id as string, 10);
      await FAQModel.updateFAQ({
        id,
        question: req.body.question,
        answer: req.body.answer,
      });

      req.flash('alertMessage', 'FAQ updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/faqs');
  }

  static async clients(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const clients = await ClientModel.getAllClients();

    res.render('admin/clients', {
      title: 'Hivemind | Clients',
      view: 'client',
      user,
      clients,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    });
  }

  static async addClient(req: Request, res: Response) {
    try {
      await ClientModel.addClient({
        logo: req.file!.filename,
        name: req.body.clientName,
      });

      req.flash('alertMessage', 'Client added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/clients');
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const client = await ClientModel.getClient(id);

      await unlink(`public/images/${client!.logo}`);
      await ClientModel.deleteClient(id);

      req.flash('alertMessage', 'Client deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/clients');
  }

  static async testimonies(req: Request, res: Response) {
    const testimonies = await TestimonyModel.getAllTestimony();
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('admin/testimonies', {
      title: 'Hivemind | Testimony',
      view: 'testimony',
      testimonies,
      user,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    });
  }

  static async addTestimony(req: Request, res: Response) {
    try {
      await TestimonyModel.addTestimony({
        clientName: req.body.clientName,
        clientPhoto: req.file!.filename,
        occupation: req.body.occupation,
        message: req.body.message,
        rate: parseFloat(req.body.rate as string),
      });

      req.flash('alertMessage', 'Testimony added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/testimonies');
  }

  static async updateTestimony(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id as string, 10);
      const testimony = await TestimonyModel.getTestimony(id);

      if (req.file) {
        const oldClientPhoto = `public/images/${testimony!.clientPhoto}`;
        access(oldClientPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldClientPhoto);
        });
      }

      await TestimonyModel.updateTestimony({
        id,
        clientName: req.body.clientName,
        clientPhoto: req.file ? req.file.filename : testimony!.clientPhoto,
        occupation: req.body.occupation,
        message: req.body.message,
        rate: parseFloat(req.body.rate as string),
      });

      req.flash('alertMessage', 'Testimony updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      console.log(error);
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/testimonies');
  }

  static async deleteTestimony(req: Request, res: Response) {
    try {
      const testimony = await TestimonyModel.getTestimony(parseInt(req.params.id as string, 10));

      await unlink(`public/images/${testimony!.clientPhoto}`);
      await TestimonyModel.deleteTestimony(parseInt(req.params.id as string, 10));

      req.flash('alertMessage', 'Testimony deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/testimonies');
  }

  static async services(req: Request, res: Response) {
    const services = await ServiceModel.getAllServices();
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('admin/services', {
      title: 'Hivemind | Services',
      view: 'service',
      services,
      user,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    });
  }

  static async addService(req: Request, res: Response) {
    try {
      await ServiceModel.addService({
        name: req.body.serviceName,
        description: req.body.description,
        thumbnail: req.file!.filename,
      });

      req.flash('alertMessage', 'Service added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/services');
  }

  static async updateService(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id as string, 10);
      const service = await ServiceModel.getService(id);

      if (req.file) {
        const oldThumbnail = `public/images/${service!.thumbnail}`;
        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail);
        });
      }

      await ServiceModel.updateService({
        id,
        name: req.body.serviceName,
        description: req.body.description,
        thumbnail: req.file ? req.file.filename : service!.thumbnail,
      });

      req.flash('alertMessage', 'Service updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/services');
  }

  static async deleteService(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await ServiceModel.deleteService(id);

      req.flash('alertMessage', 'Service deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/admin/services');
  }
}

export default AdminController;
