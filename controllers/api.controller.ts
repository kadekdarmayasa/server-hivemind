import { Request, Response } from 'express'
import path from 'path'
import dateFormat from '../lib/date.format'
import { access, constants } from 'node:fs'
import { db } from '../lib/server.db'

interface Portfolio {
  id: string
  name: string
  thumbnail: string
  orientation: string
  service: {
    id: string
    name: string
  }
}

class ApiController {
  static async homepage(req: Request, res: Response) {
    try {
      const [clients, services, portfolios, testimonies, blogs] =
        await Promise.all([
          db.client.findMany(),
          db.service.findMany({
            select: {
              id: true,
              name: true,
              description: true,
              thumbnail: true,
            },
          }),
          db.portfolio.findMany({
            take: 6,
            skip: 0,
            where: { orientation: 'LANDSCAPE' },
            orderBy: { id: 'desc' },
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
              clientName: true,
              clientPhoto: true,
              occupation: true,
              message: true,
              rate: true,
            },
          }),
          db.blog.findMany({
            orderBy: { id: 'desc' },
            select: {
              id: true,
              thumbnail: true,
              title: true,
              slug: true,
              description: true,
              publishedAt: true,
              published: true,
              author: { select: { username: true } },
            },
          }),
        ])

      const mappedBlogs = blogs
        .filter((blog) => blog.published)
        .map((blog) => ({
          ...blog,
          publishedAt: dateFormat(new Date(blog.publishedAt!)),
        }))

      res.status(200).json({
        status: 'success',
        data: {
          homepage: {
            clients,
            services,
            portfolios,
            testimonies,
            blogs: mappedBlogs,
          },
        },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async getImage(req: Request, res: Response) {
    try {
      const { filename } = req.params
      const image = path.join(__dirname, `../public/images/${filename}`)

      access(image, constants.F_OK, (err) => {
        if (err) {
          res.status(404).json({
            status: 'failed',
            message: 'Image not found',
          })
        } else {
          res.status(200).sendFile(image)
        }
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async services(req: Request, res: Response) {
    try {
      const services = await db.service.findMany({
        include: {
          portfolio: true,
        },
      })

      res.status(200).json({
        status: 'success',
        data: { services },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async blogs(req: Request, res: Response) {
    try {
      const { page } = req.body
      const take = 5
      const skip = (page - 1) * take

      const [blogs, nextBlogsData] = await Promise.all([
        db.blog.findMany({
          take,
          skip,
          orderBy: { id: 'desc' },
          where: {
            published: true,
          },
          select: {
            id: true,
            thumbnail: true,
            title: true,
            slug: true,
            description: true,
            publishedAt: true,
            published: true,
            author: { select: { username: true } },
          },
        }),
        db.blog.findMany({
          take,
          skip: page * take,
          where: {
            published: true,
          },
          select: {
            id: true,
            thumbnail: true,
            title: true,
            slug: true,
            description: true,
            publishedAt: true,
            published: true,
            author: { select: { username: true } },
          },
        }),
      ])

      const mappedBlogs = blogs.map((blog) => ({
        ...blog,
        publishedAt: dateFormat(new Date(blog.publishedAt!)),
      }))

      res.status(200).json({
        status: 'success',
        data: {
          blogs: mappedBlogs,
          hasMore: nextBlogsData.length > 0,
        },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async getBlog(req: Request, res: Response) {
    try {
      const slug: string = String(req.params.slug)
      const blog = await db.blog.findFirst({
        where: { slug },
        select: {
          id: true,
          thumbnail: true,
          title: true,
          slug: true,
          description: true,
          publishedAt: true,
          content: true,
          coverImage: true,
          published: true,
          author: { select: { username: true } },
        },
      })

      if (!blog) {
        return res
          .status(404)
          .json({ status: 'failed', message: 'Blog not found' })
      }

      const mappedBlog = {
        ...blog,
        publishedAt: dateFormat(new Date(blog.publishedAt!)),
      }

      res.status(200).json({
        status: 'success',
        data: {
          blog: mappedBlog,
        },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async faqs(req: Request, res: Response) {
    try {
      const faqs = await db.faq.findMany()
      res.status(200).json({
        status: 'success',
        data: { faqs },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async portfolios(req: Request, res: Response) {
    try {
      const page: number = parseInt(req.body.page as string, 10)
      const serviceId: string = String(req.body.serviceId)
      const take: number = 5
      const skip: number = (page - 1) * take
      let portfolios: Portfolio[]
      let nextPortfoliosData: Portfolio[]

      if (serviceId !== '000000-0000-0000-0000-000000000000') {
        portfolios = await db.portfolio.findMany({
          skip,
          take,
          where: { serviceId },
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
        })
      } else {
        portfolios = await db.portfolio.findMany({
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
        })
      }

      if (serviceId !== '000000-0000-0000-0000-000000000000') {
        nextPortfoliosData = await db.portfolio.findMany({
          take,
          skip: page * take,
          orderBy: {
            id: 'desc',
          },
          where: {
            serviceId,
          },
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
        })
      } else {
        nextPortfoliosData = await db.portfolio.findMany({
          take,
          skip: page * take,
          orderBy: {
            id: 'desc',
          },
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
        })
      }

      const mappedPortfolios = portfolios
        .filter((portfolio) => {
          if (serviceId !== '000000-0000-0000-0000-000000000000')
            return portfolio.service.id === serviceId
          return true
        })
        .map((portfolio) => ({
          ...portfolio,
          orientation: portfolio.orientation.toLowerCase(),
        }))

      res.status(200).json({
        status: 'success',
        data: {
          portfolios: mappedPortfolios,
          hasMore: nextPortfoliosData.length > 0,
        },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
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
          publicPhoto: true,
          linkedin: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      })

      res.status(200).json({
        status: 'success',
        data: { teams },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async getSubscribers(req: Request, res: Response) {
    try {
      const subscribers = await db.subscriber.findMany({
        select: { email: true },
      })

      res.status(200).json({
        status: 'success',
        data: { subscribers },
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }

  static async addSubscriber(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const subscriber = await db.subscriber.findFirst({
        where: { email },
      })

      if (subscriber) {
        return res.status(400).json({
          status: 'failed',
          message: 'Email already subscribed',
        })
      }

      await db.subscriber.create({ data: { email } })
      res.status(201).json({
        status: 'success',
        message: 'Subscribed successfully',
      })
    } catch (err: any) {
      res.status(500).json({
        status: 'failed',
        message: err.message,
      })
    }
  }
}

export default ApiController
