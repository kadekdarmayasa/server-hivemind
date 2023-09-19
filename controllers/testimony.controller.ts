import { Request, Response } from 'express'
import { db } from '../lib/server.db'
import { unlink } from 'node:fs/promises'
import { access, constants } from 'node:fs'

class TestimonyController {
  static async index(req: Request, res: Response) {
    const [user, testimonies] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
      }),
      db.testimony.findMany(),
    ])

    res.render('testimonies', {
      title: 'Hivemind | Testimony',
      view: 'testimony',
      testimonies,
      user,
      alert: {
        type: req.flash('alertType'),
        message: req.flash('alertMessage'),
      },
    })
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
      })

      req.flash('alertMessage', 'Testimony added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/testimonies')
  }

  static async updateTestimony(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const testimony = await db.testimony.findFirst({
        where: { id },
        select: { clientPhoto: true },
      })

      if (req.file) {
        const oldClientPhoto = `public/images/${testimony!.clientPhoto}`
        access(oldClientPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldClientPhoto)
        })
      }

      await db.testimony.update({
        where: { id },
        data: {
          clientName: req.body.clientName,
          clientPhoto: req.file ? req.file?.filename : testimony!.clientPhoto,
          occupation: req.body.occupation,
          message: req.body.message,
          rate: parseFloat(req.body.rate as string),
        },
      })

      req.flash('alertMessage', 'Testimony updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      console.log(error)
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/testimonies')
  }

  static async deleteTestimony(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const testimony = await db.testimony.findFirst({ where: { id } })

      await Promise.all([
        unlink(`public/images/${testimony!.clientPhoto}`),
        db.testimony.delete({ where: { id } }),
      ])

      req.flash('alertMessage', 'Testimony deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/testimonies')
  }
}

export default TestimonyController
