import { Request, Response } from 'express';
import { unlink } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import '../types/express.session';
import bcrypt from 'bcryptjs';
import { isFilesEmpty } from '../lib/multer.files';
import { notifySubcribers } from '../lib/notify.subscriber';
import { db } from '../lib/server.db';
import { CustomFiles } from '../types/custom.files';

class UserController {
  static async index(req: Request, res: Response) {
    res.redirect('/user/dashboard');
  }

  static async dashboard(req: Request, res: Response) {
    const userId: string = req.session.user!.id;
    const [user, users, services, portfolios, clients] = await Promise.all([
      db.user.findFirst({
        where: { id: userId },
      }),
      db.user.findMany(),
      db.service.findMany(),
      db.portfolio.findMany(),
      db.client.findMany(),
    ]);

    res.render(`user/dashboard`, {
      title: 'Hivemind | Dashboard',
      view: 'dashboard',
      user,
      totalTeams: users.length,
      totalServices: services.length,
      totalPortfolios: portfolios.length,
      totalClients: clients.length,
    });
  }

  static async profile(req: Request, res: Response) {
    const [user, role, roles] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
      }),
      db.role.findFirst({
        where: { id: req.session.user!.roleId },
      }),
      db.role.findMany(),
    ]);

    res.render('user/profile', {
      title: 'Hivemind | User Profile',
      view: 'profile',
      roles,
      user: {
        ...user,
        email: user!.email || 'N/A',
        linkedin: user!.linkedin || 'N/A',
        role: role!.name,
      },
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      await db.user.update({
        where: {
          id: req.session.user!.id,
        },
        data: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          linkedin: req.body.linkedin,
          roleId: req.body.roleId,
        },
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
      const userId: string = req.session.user!.id;
      const user = await db.user.findFirst({
        where: { id: userId },
        select: { password: true },
      });

      if (!bcrypt.compareSync(req.body.currentPassword, user!.password)) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(8);
      await db.user.update({
        where: { id: userId },
        data: {
          password: bcrypt.hashSync(req.body.newPassword, salt),
        },
      });
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
      res.redirect('/user/profile');
    }
  }

  static async updatePhotoProfile(req: Request, res: Response) {
    try {
      const userId: string = req.session.user!.id;
      const user = await db.user.findFirst({
        where: { id: userId },
        select: { photo: true },
      });

      if (req.file && user!.photo !== 'default-profile.png') {
        const oldPhoto = `public/images/${user!.photo}`;
        access(oldPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPhoto);
        });
      }

      await db.user.update({
        where: { id: userId },
        data: {
          photo: req.file?.filename ?? user!.photo,
        },
      });
      return res.status(200).json({ message: 'Photo profile updated successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async roles(req: Request, res: Response) {
    const [roles, user] = await Promise.all([
      db.role.findMany(),
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

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
      const name: string = req.body.roleName;
      await db.role.create({
        data: { name },
      });

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
      await db.role.update({
        where: { id: req.body.roleId },
        data: { name: req.body.roleName },
      });

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
      await db.role.delete({
        where: { id: req.params.id },
      });

      req.flash('alertMessage', 'Role deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/roles');
  }

  static async teams(req: Request, res: Response) {
    const [user, teams, roles] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.user.findMany({
        where: {
          role: {
            isNot: {
              name: 'Admin',
            },
          },
        },
        include: { role: true },
      }),
      db.role.findMany(),
    ]);

    res.render('user/teams', {
      title: 'Hivemind | Teams',
      view: 'teams',
      user,
      teams,
      roles,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    });
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const id: string = req.body.id;
      const team = await db.user.findFirst({
        where: { id },
      });

      if (req.file) {
        const oldPublicPhoto = `public/images/${team!.publicPhoto}`;
        access(oldPublicPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPublicPhoto);
        });
      }

      await db.user.update({
        where: { id },
        data: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          linkedin: req.body.linkedin,
          roleId: req.body.roleId,
          publicPhoto: req.file?.filename ?? team!.publicPhoto,
        },
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
      const salt: string = bcrypt.genSaltSync(8);

      await db.user.create({
        data: {
          name: req.body.name,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, salt),
          email: req.body.email,
          linkedin: req.body.linkedin,
          photo: 'default-profile.png',
          publicPhoto: req.file!.filename,
          roleId: req.body.roleId,
        },
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
      const id: string = String(req.params.id);
      const team = await db.user.findFirst({
        where: { id },
        select: {
          photo: true,
          publicPhoto: true,
        },
      });

      await Promise.all([
        unlink(`public/images/${team!.photo}`),
        unlink(`public/images/${team!.publicPhoto}`),
        db.user.delete({ where: { id } }),
      ]);

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Team was successfully deleted');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/teams');
  }

  static async blogs(req: Request, res: Response) {
    const [user, services, blogs] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.service.findMany(),
      db.blog.findMany(),
    ]);

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
      const files = req.files as CustomFiles;

      await db.blog.create({
        data: {
          title: req.body.title,
          slug: req.body.slug + '-' + Date.now(),
          description: req.body.description,
          content: req.body.content,
          thumbnail: files['blogThumbnail'][0].filename,
          coverImage: files['coverImage'][0].filename,
          published: false,
          publishedAt: new Date(),
          authorId: req.session.user!.id,
        },
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
      const id: string = String(req.params.id);
      const [user, services, blog] = await Promise.all([
        db.user.findFirst({
          where: { id: req.session.user!.id },
        }),
        db.service.findMany(),
        db.blog.findFirst({
          where: { id },
        }),
      ]);

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
      const files = req.files as CustomFiles;
      const blogThumbnail = files['blogThumbnail'];
      const coverImage = files['coverImage'];
      const id: string = String(req.params.id);
      const blog = await db.blog.findFirst({ where: { id } });

      if (!isFilesEmpty(files)) {
        const oldThumbnail = `public/images/${blog!.thumbnail}`;
        const oldCoverImage = `public/images/${blog!.coverImage}`;

        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail);
        });

        access(oldCoverImage, constants.F_OK, (err) => {
          if (!err) unlink(oldCoverImage);
        });
      }

      await db.blog.update({
        where: { id },
        data: {
          title: req.body.title,
          slug: req.body.slug,
          description: req.body.description,
          content: req.body.content,
          thumbnail: blogThumbnail[0]?.filename ?? blog!.thumbnail,
          coverImage: coverImage[0]?.filename ?? blog!.coverImage,
          published: blog!.published,
          publishedAt: blog!.published ? blog!.publishedAt : new Date(),
          authorId: blog!.authorId,
        },
      });

      req.flash('alertMessage', 'Blog updated successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect(`/user/blogs/update/${req.params.id}`);
  }

  static async deleteBlog(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id);
      const blog = await db.blog.findFirst({
        where: { id },
      });

      await Promise.all([
        unlink(`public/images/${blog!.thumbnail}`),
        unlink(`public/images/${blog!.coverImage}`),
        db.blog.delete({
          where: { id },
        }),
      ]);

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
      const id: string = String(req.body.id);
      const blog = await db.blog.findFirst({
        where: { id },
      });

      await db.blog.update({
        where: { id },
        data: {
          title: blog!.title,
          slug: blog!.slug,
          description: blog!.description,
          content: blog!.content,
          thumbnail: blog!.thumbnail,
          coverImage: blog!.coverImage,
          published: true,
          publishedAt: new Date(),
          authorId: blog!.authorId,
        },
      });

      const subscribers = await db.subscriber.findMany();
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
    const [user, subscribers] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
      }),
      db.subscriber.findMany(),
    ]);

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
      const email: string = req.body.email;
      const subscriber = await db.subscriber.findFirst({ where: { email } });

      if (subscriber) throw new Error('Subscriber already exists');
      await db.subscriber.create({ data: { email } });

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
      const id: string = String(req.body.id);
      const email: string = req.body.email;

      await db.subscriber.update({
        where: { id },
        data: { email },
      });

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
      await db.subscriber.delete({ where: { id: req.params.id } });

      req.flash('alertMessage', 'Subscriber deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/subscribers');
  }

  static async faqs(req: Request, res: Response) {
    const [user, faqs] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.faq.findMany(),
    ]);

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
      await db.faq.create({
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
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
      await db.faq.delete({ where: { id: req.params.id } });

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
      await db.faq.update({
        where: { id: req.body.id },
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
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
    const [user, clients] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.client.findMany(),
    ]);

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
      await db.client.create({
        data: {
          logo: req.file!.filename,
          name: req.body.clientName,
        },
      });

      req.flash('alertMessage', 'Client added successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/clients');
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const client = await db.client.findFirst({
        where: {
          id: req.body.clientId,
        },
      });

      if (req.file) {
        const oldLogo = `public/images/${client!.logo}`;
        access(oldLogo, constants.F_OK, (err) => {
          if (!err) unlink(oldLogo);
        });
      }

      await db.client.update({
        where: {
          id: req.body.clientId,
        },
        data: {
          logo: req.file?.filename ?? client!.logo,
          name: req.body.clientName,
        },
      });

      req.flash('alertType', 'success');
      req.flash('alertMessage', 'Client updated successfully');
    } catch (error: any) {
      req.flash('alertType', 'danger');
      req.flash('alertMessage', error.message);
    }

    res.redirect('/user/clients');
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id);
      const client = await db.client.findFirst({
        where: { id },
        select: { logo: true },
      });

      await Promise.all([
        unlink(`public/images/${client!.logo}`),
        db.client.delete({ where: { id } }),
      ]);

      req.flash('alertMessage', 'Client deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/clients');
  }

  static async testimonies(req: Request, res: Response) {
    const [user, testimonies] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
      }),
      db.testimony.findMany(),
    ]);

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
      await db.testimony.create({
        data: {
          clientName: req.body.clientName,
          clientPhoto: req.file!.filename,
          occupation: req.body.occupation,
          message: req.body.message,
          rate: parseFloat(req.body.rate as string),
        },
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
      const id: string = String(req.body.id);
      const testimony = await db.testimony.findFirst({
        where: { id },
        select: { clientPhoto: true },
      });

      if (req.file) {
        const oldClientPhoto = `public/images/${testimony!.clientPhoto}`;
        access(oldClientPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldClientPhoto);
        });
      }

      await db.testimony.update({
        where: { id },
        data: {
          clientName: req.body.clientName,
          clientPhoto: req.file?.filename ?? testimony!.clientPhoto,
          occupation: req.body.occupation,
          message: req.body.message,
          rate: parseFloat(req.body.rate as string),
        },
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
      const id: string = String(req.params.id);
      const testimony = await db.testimony.findFirst({ where: { id } });

      await Promise.all([
        unlink(`public/images/${testimony!.clientPhoto}`),
        db.testimony.delete({ where: { id } }),
      ]);

      req.flash('alertMessage', 'Testimony deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/testimonies');
  }

  static async services(req: Request, res: Response) {
    const [user, services] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.service.findMany(),
    ]);

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
      await db.service.create({
        data: {
          name: req.body.serviceName,
          description: req.body.description,
          thumbnail: req.file!.filename,
        },
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
      const id: string = String(req.body.id);
      const service = await db.service.findFirst({
        where: { id },
        select: { thumbnail: true },
      });

      if (req.file) {
        const oldThumbnail = `public/images/${service!.thumbnail}`;
        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail);
        });
      }

      await db.service.update({
        where: { id },
        data: {
          name: req.body.serviceName,
          description: req.body.description,
          thumbnail: req.file?.filename ?? service!.thumbnail,
        },
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
      const id: string = String(req.params.id);
      const service = await db.service.findFirst({
        where: { id },
        include: { portfolio: true },
      });

      if (service!.portfolio.length > 0) {
        throw new Error('Service is being used by portfolios, delete them first!');
      }

      await Promise.all([
        unlink(`public/images/${service!.thumbnail}`),
        db.service.delete({ where: { id } }),
      ]);

      req.flash('alertMessage', 'Service deleted successfully');
      req.flash('alertType', 'success');
    } catch (error: any) {
      req.flash('alertMessage', error.message);
      req.flash('alertType', 'danger');
    }

    res.redirect('/user/services');
  }

  static async portfolios(req: Request, res: Response) {
    const [user, services, portfolios] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.service.findMany(),
      db.portfolio.findMany(),
    ]);

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
      await db.portfolio.create({
        data: {
          name: req.body.portfolioName,
          thumbnail: req.file!.filename,
          orientation: req.body.orientation,
          serviceId: req.body.serviceId,
        },
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
      const id: string = String(req.body.portfolioId);
      const portfolio = await db.portfolio.findFirst({
        where: { id },
        select: { thumbnail: true },
      });

      if (req.file) {
        const oldThumbnail = `public/images/${portfolio!.thumbnail}`;
        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail);
        });
      }

      await db.portfolio.update({
        where: { id },
        data: {
          name: req.body.portfolioName,
          thumbnail: req.file?.filename ?? portfolio!.thumbnail,
          orientation: req.body.orientation,
          serviceId: req.body.serviceId,
        },
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
      const id: string = String(req.params.id);
      const portfolio = await db.portfolio.findFirst({
        where: { id },
        select: { thumbnail: true },
      });

      await Promise.all([
        unlink(`public/images/${portfolio!.thumbnail}`),
        db.portfolio.delete({ where: { id } }),
      ]);

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
