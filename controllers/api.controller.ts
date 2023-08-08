import { Request, Response } from 'express';
import ClientModel from '../models/client.model';
import ServiceModel from '../models/service.model';
import path from 'path';
import PortfolioModel from '../models/portfolio.model';
import TestimonyModel from '../models/testimony.model';
import BlogModel from '../models/blog.model';
import UserModel from '../models/user.model';
import dateFormat from '../lib/date.format';
import { access, constants } from 'node:fs';

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
}

export default ApiController;
