import { Request, Response } from 'express'
import { db } from '../lib/server.db'

class SubscriberController {
  static async index(req: Request, res: Response) {
    const [user, subscribers] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
      }),
      db.subscriber.findMany(),
    ])

    res.render('subscribers', {
      title: 'Hivemind | Subscribers',
      view: 'subscriber',
      user,
      subscribers,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    })
  }

  static async addSubscriber(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const subscriber = await db.subscriber.findFirst({
        where: { email },
      })

      if (subscriber) throw new Error('Subscriber already exists')
      await db.subscriber.create({ data: { email } })

      req.flash('alertMessage', 'Subscriber added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/subscribers')
  }

  static async updateSubscriber(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const email: string = req.body.email

      await db.subscriber.update({
        where: { id },
        data: { email },
      })

      req.flash('alertMessage', 'Subscriber updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/subscribers')
  }

  static async deleteSubscriber(req: Request, res: Response) {
    try {
      await db.subscriber.delete({ where: { id: req.params.id } })

      req.flash('alertMessage', 'Subscriber deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/subscribers')
  }
}

export default SubscriberController
