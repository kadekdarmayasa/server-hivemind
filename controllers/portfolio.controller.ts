import { Request, Response } from 'express'
import { db } from '../lib/server.db'
import { constants, access } from 'node:fs'
import { unlink } from 'node:fs/promises'

class PortfolioController {
  static async index(req: Request, res: Response) {
    const [user, services, portfolios] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.service.findMany(),
      db.portfolio.findMany(),
    ])

    res.render('portfolios', {
      title: 'Hivemind | Portfolio',
      view: 'portfolio',
      user,
      services,
      portfolios,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    })
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
      })

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Portfolio added successfully')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/portfolios')
  }

  static async updatePortfolio(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const portfolio = await db.portfolio.findFirst({
        where: { id },
        select: { thumbnail: true },
      })

      if (req.file) {
        const oldThumbnail = `public/images/${portfolio!.thumbnail}`
        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail)
        })
      }

      await db.portfolio.update({
        where: { id },
        data: {
          name: req.body.portfolioName,
          thumbnail: req.file?.filename ?? portfolio!.thumbnail,
          orientation: req.body.orientation,
          serviceId: req.body.serviceId,
        },
      })

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Portfolio updated successfully')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/portfolios')
  }

  static async deletePortfolio(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const portfolio = await db.portfolio.findFirst({
        where: { id },
        select: { thumbnail: true },
      })

      await Promise.all([
        unlink(`public/images/${portfolio!.thumbnail}`),
        db.portfolio.delete({ where: { id } }),
      ])

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Portfolio deleted successfully')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/portfolios')
  }
}

export default PortfolioController
