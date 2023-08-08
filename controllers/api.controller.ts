import { Request, Response } from 'express';
import path from 'path';
import UserModel from '../models/user.model';
import dateFormat from '../lib/date.format';
import { access, constants } from 'node:fs';
import { db } from '../lib/server.db';

class ApiController {
  static async homepage(req: Request, res: Response) {
    try {
      const [clients, users, services, portfolios, testimonies, blogs] = await Promise.all([
        db.client.findMany(),
        db.user.findMany({
          select: {
            id: true,
            username: true,
          },
        }),
        db.service.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            thumbnail: true,
          },
        }),
        db.portfolio.findMany({
          select: {
            id: true,
            name: true,
            thumbnail: true,
            orientation: true,
            service: { select: { id: true, name: true } },
          },
        }),
        db.testimony.findMany({
          select: {
            id: true,
            client_name: true,
            client_photo: true,
            occupation: true,
            message: true,
            rate: true,
          },
        }),
        db.blog.findMany({
          select: {
            id: true,
            thumbnail: true,
            title: true,
            slug: true,
            description: true,
            published_at: true,
            published: true,
            userId: true,
          },
        }),
      ]);

      const mappedBlogs = blogs
        .filter((blog) => blog.published)
        .map((blog) => ({
          ...blog,
          published_at: dateFormat(new Date(blog.published_at!)),
          author: users.find((user) => user.id === blog.userId)!.username,
        }));

      res.status(200).json({
        clients,
        services,
        portfolios,
        testimonies,
        blogs: mappedBlogs,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getImage(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const image = path.join(__dirname, `../public/images/${filename}`);

      access(image, constants.F_OK, (err) => {
        if (err) {
          res.status(404).json({ message: 'Image not found' });
        } else {
          res.status(200).sendFile(image);
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBlogs(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          username: true,
        },
      });

      const blogs = await db.blog.findMany({
        select: {
          id: true,
          thumbnail: true,
          title: true,
          slug: true,
          description: true,
          published_at: true,
          published: true,
          userId: true,
        },
      });

      const mappedBlogs = blogs
        .filter((blog) => blog.published)
        .map((blog) => ({
          ...blog,
          published_at: dateFormat(new Date(blog.published_at!)),
          author: users.find((user) => user.id === blog.userId)!.username,
        }));

      res.status(200).json({ blogs: mappedBlogs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBlog(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id as string, 10);
      const blog = await db.blog.findFirst({
        where: { id },
        select: {
          id: true,
          thumbnail: true,
          title: true,
          slug: true,
          description: true,
          published_at: true,
          content: true,
          cover_image: true,
          published: true,
          userId: true,
        },
      });

      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.status(200).json({
        blog: {
          ...blog,
          published_at: dateFormat(new Date(blog.published_at!)),
          author: (await UserModel.getUser(blog.userId!))?.username,
        },
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async faqs(req: Request, res: Response) {
    try {
      const faqs = await db.faq.findMany();
      res.status(200).json({ faqs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async portfolios(req: Request, res: Response) {
    try {
      const page: number = parseInt(req.body.page as string, 10);
      const serviceId: number = parseInt(req.body.serviceId as string, 10);
      const take: number = 5;
      const skip: number = (page - 1) * take;

      const portfolios = await db.portfolio.findMany({
        skip,
        take,
        select: {
          id: true,
          name: true,
          thumbnail: true,
          orientation: true,
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const mappedPortfolios = portfolios
        .filter((portfolio) => {
          if (serviceId !== 0) return portfolio.service.id === serviceId;
          return true;
        })
        .map((portfolio) => ({
          ...portfolio,
          orientation: portfolio.orientation.toLowerCase(),
        }));

      res.status(200).json({ portfolios: mappedPortfolios });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async teams(req: Request, res: Response) {
    try {
      const teams = await db.user.findMany({
        where: {
          NOT: {
            role: {
              name: 'Admin',
            },
          },
        },
        select: {
          id: true,
          name: true,
          public_photo: true,
          linkedin: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      res.status(200).json({ teams });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async subscriber(req: Request, res: Response) {
    try {
      const email: string = req.body.email;
      const subscriber = await db.subscriber.findFirst({ where: { email } });
      if (subscriber) return res.status(400).json({ message: 'Email already subscribed' });

      await db.subscriber.create({ data: { email } });
      res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ApiController;
