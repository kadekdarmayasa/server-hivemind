import { Request, Response } from 'express'
import { db } from '../lib/server.db'
import { access, constants } from 'node:fs'
import { unlink } from 'node:fs/promises'

class ServiceController {
  static async index(req: Request, res: Response) {
    const [user, services] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.service.findMany(),
    ])

    res.render('services', {
      title: 'Hivemind | Services',
      view: 'service',
      services,
      user,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    })
  }

  static async addService(req: Request, res: Response) {
    try {
      await db.service.create({
        data: {
          name: req.body.serviceName,
          description: req.body.description,
          thumbnail: req.file!.filename,
        },
      })

      req.flash('alertMessage', 'Service added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/services')
  }

  static async updateService(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const service = await db.service.findFirst({
        where: { id },
        select: { thumbnail: true },
      })

      if (req.file) {
        const oldThumbnail = `public/images/${service!.thumbnail}`
        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail)
        })
      }

      await db.service.update({
        where: { id },
        data: {
          name: req.body.serviceName,
          description: req.body.description,
          thumbnail: req.file?.filename ?? service!.thumbnail,
        },
      })

      req.flash('alertMessage', 'Service updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/services')
  }

  static async deleteService(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const service = await db.service.findFirst({
        where: { id },
        include: { portfolio: true },
      })

      if (service!.portfolio.length > 0) {
        throw new Error(
          'Service is being used by portfolios, delete them first!'
        )
      }

      await Promise.all([
        unlink(`public/images/${service!.thumbnail}`),
        db.service.delete({ where: { id } }),
      ])

      req.flash('alertMessage', 'Service deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/services')
  }
}

export default ServiceController
