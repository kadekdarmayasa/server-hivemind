import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import SubscriberModel from '../models/subscriber.model';
import FAQModel from '../models/faq.model';
import ClientModel from '../models/client.model';
import TestimonyModel from '../models/testimony.model';
import ServiceModel from '../models/service.model';
import PortfolioModel from '../models/portfolio.model';
import RoleModel from '../models/role.model';
import BlogModel from '../models/blog.model';
import { User } from '../types/user';
import { unlink } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import '../types/express.session';
import bcrypt from 'bcryptjs';
import { isFilesEmpty } from '../lib/multer.files';
import { notifySubcribers } from '../lib/notify.subscriber';

class UserController {
  static async index(req: Request, res: Response) {
    res.redirect('/user/dashboard');
  }

  static async dashboard(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const totalTeams = (await UserModel.getUsers()).length;
    const totalServices = (await ServiceModel.getAllServices()).length;
    const totalPortfolios = (await PortfolioModel.getAllPortfolios()).length;
    const totalClients = (await ClientModel.getAllClients()).length;

    res.render(`user/dashboard`, {
      title: 'Hivemind | Dashboard',
      view: 'dashboard',
      user,
      totalTeams,
      totalServices,
      totalPortfolios,
      totalClients,
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
      await UserModel.updateUser({
        id: parseInt(req.body.id as string, 10),
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

  static async updatePassword(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.body.id as string, 10);
      const user = await UserModel.getUser(userId);
      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;

      if (!bcrypt.compareSync(currentPassword, user!.password)) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(8);
      await UserModel.updatePassword(userId, bcrypt.hashSync(newPassword, salt));
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
      res.redirect('/user/profile');
    }
  }

  static async updatePhotoProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.body.id as string, 10);
      const user = await UserModel.getUser(userId);

      if (req.file && user!.photo !== 'default-profile.png') {
        const oldPhoto = `public/images/${user!.photo}`;
        access(oldPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPhoto);
        });
      }

      await UserModel.updatePhotoProfile(userId, req.file!.filename);
      return res.status(200).json({ message: 'Photo profile updated successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async roles(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

    res.render('user/roles', {
      title: 'Hivemind | Roles',
      view: 'teams',
      user,
      roles,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async addRole(req: Request, res: Response) {
    try {
      await RoleModel.addRole(req.body.roleName);

      req.flash('alertMessage', 'Role added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/roles');
  }

  static async updateRole(req: Request, res: Response) {
    try {
      await RoleModel.updateRole(parseInt(req.body.roleId as string, 10), req.body.roleName);

      req.flash('alertMessage', 'Role updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/roles');
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      await RoleModel.deleteRole(parseInt(req.params.id as string, 10));

      req.flash('alertMessage', 'Role deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/roles');
  }

  static async teams(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const teams = await UserModel.getUsers();
    const roles = await RoleModel.getAllRoles();

    type UserWithRole = User & { roleName: string };
    const mappedTeams = [] as UserWithRole[];
    teams.forEach((team) => {
      const roleName = roles.find((role) => role.id === team.roleId)!.name;
      if (user!.roleId === team.roleId) user!.roleName = roleName;
      if (roleName !== 'Admin') mappedTeams.push({ ...team, roleName });
    });

    res.render('user/teams', {
      title: 'Hivemind | Teams',
      view: 'teams',
      user,
      teams: mappedTeams,
      roles,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.body.id as string, 10);
      const team = await UserModel.getUser(id);

      if (req.file) {
        const oldPublicPhoto = `public/images/${team!.public_photo}`;
        access(oldPublicPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPublicPhoto);
        });
      }

      await UserModel.updateUser({
        id,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        roleId: parseInt(req.body.roleId as string, 10),
        linkedin: req.body.linkedin,
        public_photo: req.file ? req.file.filename : team!.public_photo,
      });

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Team was successfully updated');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/teams');
  }

  static async addTeam(req: Request, res: Response) {
    try {
      const salt = bcrypt.genSaltSync(8);
      const password = bcrypt.hashSync(req.body.password, salt);

      await UserModel.addUser({
        name: req.body.name,
        username: req.body.username,
        password,
        email: req.body.email,
        linkedin: req.body.linkedin,
        photo: 'default-profile.png',
        public_photo: req.file!.filename,
        roleId: parseInt(req.body.roleId as string, 10),
      });

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Team was successfully added');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/teams');
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const team = await UserModel.getUser(id);

      await unlink(`public/images/${team!.photo}`);
      await unlink(`public/images/${team!.public_photo}`);
      await UserModel.deleteUser(id);

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Team was successfully deleted');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/teams');
  }

  static async blogs(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const services = await ServiceModel.getAllServices();
    const blogs = await BlogModel.getAllBlogs();
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

    res.render('user/blogs', {
      title: 'Hivemind | Blogs',
      view: 'blog',
      user,
      blogs,
      services,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async addBlog(req: Request, res: Response) {
    try {
      const thumbnail = (req.files as { [fieldname: string]: Express.Multer.File[] })[
        'blogThumbnail'
      ];
      const coverImage = (req.files as { [fieldname: string]: Express.Multer.File[] })[
        'coverImage'
      ];

      await BlogModel.addBlog({
        title: req.body.title,
        slug: req.body.slug + '-' + Date.now(),
        description: req.body.description,
        content: req.body.content,
        thumbnail: thumbnail[0].filename,
        cover_image: coverImage[0].filename,
        published: false,
        published_at: new Date(),
        userId: req.session.user!.id,
      });

      req.flash('alertMessage', 'Blog added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/blogs');
  }

  static async updateBlogView(req: Request, res: Response) {
    try {
      const user = await UserModel.getUser(req.session.user!.id);
      const services = await ServiceModel.getAllServices();
      const id = parseInt(req.params.id as string, 10);
      const blog = await BlogModel.getBlog(id);

      res.render('user/blogs', {
        title: 'Hivemind | Blogs',
        view: 'blog/update',
        user,
        blog,
        services,
        alert: {
          message: req.flash('alertMessage'),
          type: req.flash('alertType'),
        },
      });
    } catch (err: any) {
      req.flash('alertMessage', err.message);
      req.flash('alertType', 'danger');
      res.redirect('/user/blogs');
    }
  }

  static async updateBlog(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id as string, 10);
      const blog = await BlogModel.getBlog(id);
      const reqFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
      const thumbnail = reqFiles['blogThumbnail'][0];
      const coverImage = reqFiles['coverImage'][0];

      if (!isFilesEmpty(req.files)) {
        const oldThumbnail = `public/images/${blog!.thumbnail}`;
        const oldCoverImage = `public/images/${blog!.cover_image}`;

        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail);
        });

        access(oldCoverImage, constants.F_OK, (err) => {
          if (!err) unlink(oldCoverImage);
        });
      }

      await BlogModel.updateBlog({
        id,
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        thumbnail: isFilesEmpty(req.files) ? blog!.thumbnail : thumbnail.filename,
        cover_image: isFilesEmpty(req.files) ? blog!.cover_image : coverImage.filename,
        published: blog!.published,
        published_at: blog!.published ? blog!.published_at : new Date(),
        userId: blog!.userId,
      });

      req.flash('alertMessage', 'Blog updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect(`/user/blogs`);
  }

  static async deleteBlog(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id as string);
      const blog = await BlogModel.getBlog(id);

      await unlink(`public/images/${blog!.thumbnail}`);
      await unlink(`public/images/${blog!.cover_image}`);
      await BlogModel.deleteBlog(id);

      req.flash('alertMessage', 'Blog deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/blogs');
  }

  static async publishBlog(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id as string, 10);
      const blog = await BlogModel.getBlog(id);

      await BlogModel.updateBlog({
        id,
        title: blog!.title,
        slug: blog!.slug,
        description: blog!.description,
        content: blog!.content,
        thumbnail: blog!.thumbnail,
        cover_image: blog!.cover_image,
        published: true,
        published_at: new Date(),
        userId: blog!.userId,
      });

      const subscribers = await SubscriberModel.getAllSubscribers();
      notifySubcribers(subscribers, blog!);

      req.flash('alertMessage', 'Blog published successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/blogs');
  }

  static async subscribers(req: Request, res: Response) {
    const user = await UserModel.getUser(req.session.user!.id);
    const subscribers = await SubscriberModel.getAllSubscribers();
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

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
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

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
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

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
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

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
        client_name: req.body.clientName,
        client_photo: req.file!.filename,
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
        const oldClientPhoto = `public/images/${testimony!.client_photo}`;
        access(oldClientPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldClientPhoto);
        });
      }

      await TestimonyModel.updateTestimony({
        id,
        client_name: req.body.clientName,
        client_photo: req.file ? req.file.filename : testimony!.client_photo,
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

      await unlink(`public/images/${testimony!.client_photo}`);
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
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

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
    const roles = await RoleModel.getAllRoles();

    roles.forEach((role) => {
      if (user!.roleId === role.id) user!.roleName = role.name;
    });

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
