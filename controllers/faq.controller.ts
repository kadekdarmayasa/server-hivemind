import { Request, Response } from 'express'
import { db } from '../lib/server.db'

class FAQController {
  static async index(req: Request, res: Response) {
    const [user, faqs] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.faq.findMany(),
    ])

    res.render('faqs', {
      title: 'Hivemind | FAQs',
      view: 'faq',
      faqs,
      user,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    })
  }

  static async addFAQ(req: Request, res: Response) {
    try {
      await db.faq.create({
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
      })

      req.flash('alertMessage', 'FAQ added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/faqs')
  }

  static async deleteFAQ(req: Request, res: Response) {
    try {
      await db.faq.delete({ where: { id: req.params.id } })

      req.flash('alertMessage', 'FAQ deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/faqs')
  }

  static async updateFAQ(req: Request, res: Response) {
    try {
      await db.faq.update({
        where: { id: req.params.id },
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
      })

      req.flash('alertMessage', 'FAQ updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/faqs')
  }
}

export default FAQController
