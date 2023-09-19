import { Request, Response } from 'express'
import { db } from '../lib/server.db'
import { constants, access } from 'node:fs'
import { unlink } from 'node:fs/promises'

class ClientController {
  static async index(req: Request, res: Response) {
    const [user, clients] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.client.findMany(),
    ])

    res.render('clients', {
      title: 'Hivemind | Clients',
      view: 'client',
      user,
      clients,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    })
  }

  static async addClient(req: Request, res: Response) {
    try {
      await db.client.create({
        data: {
          logo: req.file!.filename,
          name: req.body.clientName,
        },
      })

      req.flash('alertMessage', 'Client added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/clients')
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const client = await db.client.findFirst({
        where: {
          id: req.params.id,
        },
      })

      if (req.file) {
        const oldLogo = `public/images/${client!.logo}`
        access(oldLogo, constants.F_OK, (err) => {
          if (!err) unlink(oldLogo)
        })
      }

      await db.client.update({
        where: {
          id: req.params.id,
        },
        data: {
          logo: req.file?.filename ?? client!.logo,
          name: req.body.clientName,
        },
      })

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Client updated successfully')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/clients')
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const client = await db.client.findFirst({
        where: { id },
        select: { logo: true },
      })

      await Promise.all([
        unlink(`public/images/${client!.logo}`),
        db.client.delete({ where: { id } }),
      ])

      req.flash('alertMessage', 'Client deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/clients')
  }
}

export default ClientController
