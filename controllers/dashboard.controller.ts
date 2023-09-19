import { Request, Response } from 'express'
import { db } from '../lib/server.db'

class DashboardController {
  static async index(req: Request, res: Response) {
    const userId: string = req.session.user!.id
    const [user, users, services, portfolios, clients] = await Promise.all([
      db.user.findFirst({
        where: { id: userId },
      }),
      db.user.findMany(),
      db.service.findMany(),
      db.portfolio.findMany(),
      db.client.findMany(),
    ])

    res.render(`dashboard`, {
      title: 'Hivemind | Dashboard',
      view: 'dashboard',
      user,
      totalTeams: users.length,
      totalServices: services.length,
      totalPortfolios: portfolios.length,
      totalClients: clients.length,
    })
  }
}

export default DashboardController
