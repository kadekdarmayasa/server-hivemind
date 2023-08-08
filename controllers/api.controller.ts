import { Request, Response } from 'express';
import ClientModel from '../models/client.model';
import ServiceModel from '../models/service.model';
import path from 'path';
import PortfolioModel from '../models/portfolio.model';
import TestimonyModel from '../models/testimony.model';
import FAQModel from '../models/faq.model';
import BlogModel from '../models/blog.model';
import UserModel from '../models/user.model';
import dateFormat from '../lib/date.format';
import { access, constants } from 'node:fs';
import { db } from '../lib/server.db';

class ApiController {
  static async homepage(req: Request, res: Response) {
    try {
      const users = await UserModel.getUsers();
      const clients = await ClientModel.getAllClients();
      const services = await ServiceModel.getAllServices();
      const portfolios = (await PortfolioModel.getAllPortfolios()).map((portfolio) => {
        return {
          ...portfolio,
          orientation: portfolio.orientation.toLowerCase(),
          serviceName: services.find((service) => service.id === portfolio.serviceId)?.name,
        };
      });
      const testimonies = await TestimonyModel.getAllTestimony();
      const blogs = (await BlogModel.getAllBlogs())
        .filter((blog) => blog.published)
        .map((blog) => {
          return {
            ...blog,
            published_at: dateFormat(new Date(blog.published_at!)),
            author: users.find((user) => user.id === blog.userId)?.username,
          };
        });

      res.status(200).json({ clients, services, portfolios, testimonies, blogs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getImage(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const image = path.join(__dirname, `../public/images/${name}`);

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
      const blogs = (await BlogModel.getAllBlogs())
        .filter((blog) => blog.published)
        .map((blog) => {
          return {
            ...blog,
            published_at: dateFormat(new Date(blog.published_at!)),
          };
        });

      res.status(200).json({ blogs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBlog(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id as string, 10);
      const blog = await BlogModel.getBlog(id);

      if (!blog) {
        res.status(404).json({ message: 'Blog not found' });
      } else {
        const mappedBlog = {
          ...blog,
          published_at: dateFormat(new Date(blog.published_at!)),
          author: (await UserModel.getUser(blog.userId!))?.username,
        };
        res.status(200).json({ blog: mappedBlog });
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async faqs(req: Request, res: Response) {
    try {
      const faqs = await FAQModel.getAllFAQs();
      res.status(200).json({ faqs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async portfolios(req: Request, res: Response) {
    try {
      const page: number = parseInt(req.body.page as string, 10);
      const take = 5;
      const skip = (page - 1) * take;

      if (req.body.serviceId) {
        const portfolios = await db.portfolio.findMany({
          skip,
          take,
          where: { serviceId: parseInt(req.body.serviceId as string, 10) },
          include: { service: true },
        });
        res.status(200).json({ portfolios });
      } else {
        const portfolios = await db.portfolio.findMany({
          skip,
          take,
          include: { service: true },
        });
        res.status(200).json({ portfolios });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ApiController;
