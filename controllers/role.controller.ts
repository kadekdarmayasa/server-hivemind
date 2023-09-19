import { Request, Response } from 'express'
import { db } from '../lib/server.db'

class RoleController {
  static async index(req: Request, res: Response) {
    const [roles, user] = await Promise.all([
      db.role.findMany(),
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ])

    res.render('roles', {
      title: 'Hivemind | Roles',
      view: 'teams',
      user,
      roles,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    })
  }

  static async addRole(req: Request, res: Response) {
    try {
      const name: string = req.body.roleName
      await db.role.create({
        data: { name },
      })

      req.flash('alertMessage', 'Role added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/roles')
  }

  static async updateRole(req: Request, res: Response) {
    try {
      await db.role.update({
        where: { id: req.params.id },
        data: { name: req.body.roleName },
      })

      req.flash('alertMessage', 'Role updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/roles')
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      await db.role.delete({
        where: { id: req.params.id },
      })

      req.flash('alertMessage', 'Role deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/roles')
  }
}

export default RoleController
