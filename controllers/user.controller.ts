import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import SubscriberModel from '../models/subscriber.model';
import FAQModel from '../models/faq.model';
import ClientModel from '../models/client.model';
import TestimonyModel from '../models/testimony.model';
import ServiceModel from '../models/service.model';
import PortfolioModel from '../models/portfolio.model';
import RoleModel from '../models/role.model';
import { unlink } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import '../types/express.session';

class UserController {
  static async index(req: Request, res: Response) {
    res.redirect('/user/dashboard');
  }

  static async dashboard(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);

    res.render(`user/dashboard`, {
      title: 'Hivemind | Dashboard',
      view: 'dashboard',
      user,
    });
  }

  static async profile(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const role = await RoleModel.getRole(user!.roleId);
    const roles = await RoleModel.getAllRoles();

    const mappedUser = {
      ...user,
      email: user!.email || 'N/A',
      linkedin: user!.linkedin || 'N/A',
      role: role!.name,
    };

    res.render('user/profile', {
      title: 'Hivemind | User Profile',
      view: 'profile',
      user: { ...mappedUser },
      roles,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.body.id as string, 10);
      const user = await UserModel.getUser(userId);

      await UserModel.updateUser({
        id: userId,
        password: user!.password,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        roleId: parseInt(req.body.roleId as string, 10),
        linkedin: req.body.linkedin,
      });

      req.flash('alertMessage', 'Profile updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/profile');
  }

  static async updatePhotoProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.body.id as string, 10);
      const user = await UserModel.getUser(userId);

      if (req.file) {
        const oldPhoto = `public/images/${user!.photo}`;
        access(oldPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPhoto);
        });
      }

      await UserModel.updatePhotoProfile(userId, req.file!.filename);

      req.flash('alertMessage', 'Profile photo updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/profile');
  }

  // TODO: add updateProfilePassword method

  static async subscribers(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const subscribers = await SubscriberModel.getAllSubscribers();

    res.render('user/subscribers', {
      title: 'Hivemind | Subscribers',
      view: 'subscriber',
      user,
      subscribers,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
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

    res.redirect('/user/subscribers');
  }

  static async updateSubscriber(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id as string, 10);
      const email = req.body.email;

      await SubscriberModel.updateSubscriber({ id, email });

      req.flash('alertMessage', 'Subscriber updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/subscribers');
  }

  static async deleteSubscriber(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await SubscriberModel.deleteSubscriber(id);

      req.flash('alertMessage', 'Subscriber deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/subscribers');
  }

  static async faqs(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const faqs = await FAQModel.getAllFAQs();

    res.render('user/faqs', {
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

    res.redirect('/user/faqs');
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

    res.redirect('/user/faqs');
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

    res.redirect('/user/faqs');
  }

  static async clients(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const clients = await ClientModel.getAllClients();

    res.render('user/clients', {
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

    res.redirect('/user/clients');
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

    res.redirect('/user/clients');
  }

  static async testimonies(req: Request, res: Response) {
    const testimonies = await TestimonyModel.getAllTestimony();
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('user/testimonies', {
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

    res.redirect('/user/testimonies');
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

    res.redirect('/user/testimonies');
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

    res.redirect('/user/testimonies');
  }

  static async services(req: Request, res: Response) {
    const services = await ServiceModel.getAllServices();
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('user/services', {
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

    res.redirect('/user/services');
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

    res.redirect('/user/services');
  }

  static async deleteService(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const service = await ServiceModel.getService(id);
      const portfolios = await PortfolioModel.getAllPortfolios();
      const isServiceUsed = portfolios.some((portfolio) => portfolio.serviceId === id);

      if (isServiceUsed) throw new Error('Service is being used by portfolios, delete them first!');

      await unlink(`public/images/${service!.thumbnail}`);
      await ServiceModel.deleteService(id);
      req.flash('alertMessage', 'Service deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/services');
  }

  static async portfolios(req: Request, res: Response) {
    const portfolios = await PortfolioModel.getAllPortfolios();
    const services = await ServiceModel.getAllServices();
    const user = await UserModel.getUser(req.session.user!.id);

    res.render('user/portfolios', {
      title: 'Hivemind | Portfolio',
      view: 'portfolio',
      user,
      services,
      portfolios,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    });
  }

  static async addPortfolio(req: Request, res: Response) {
    try {
      await PortfolioModel.addPortfolio({
        name: req.body.portfolioName,
        thumbnail: req.file!.filename,
        orientation: req.body.orientation,
        serviceId: parseInt(req.body.serviceId as string, 10),
      });

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Portfolio added successfully');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/portfolios');
  }

  static async updatePortfolio(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.portfolioId as string, 10);
      const portfolio = await PortfolioModel.getPortfolio(id);
      const oldThumbnail = `public/images/${portfolio!.thumbnail}`;

      if (req.file) {
        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail);
        });
      }

      await PortfolioModel.updatePortfolio({
        id,
        name: req.body.portfolioName,
        thumbnail: req.file ? req.file.filename : portfolio!.thumbnail,
        orientation: req.body.orientation,
        serviceId: parseInt(req.body.serviceId as string, 10),
      });

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Portfolio updated successfully');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/portfolios');
  }

  static async deletePortfolio(req: Request, res: Response) {
    try {
      const portfolio = await PortfolioModel.getPortfolio(parseInt(req.params.id as string, 10));

      await unlink(`public/images/${portfolio!.thumbnail}`);
      await PortfolioModel.deletePortfolio(parseInt(req.params.id as string, 10));

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Portfolio deleted successfully');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/portfolios');
  }
}

export default UserController;
