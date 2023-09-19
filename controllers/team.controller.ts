import { Request, Response } from 'express'
import { db } from '../lib/server.db'
import { access, constants } from 'node:fs'
import { unlink } from 'node:fs/promises'
import bcrypt from 'bcryptjs'

class TeamController {
  static async index(req: Request, res: Response) {
    const [user, teams, roles] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.user.findMany({
        where: {
          role: {
            isNot: {
              name: 'Admin',
            },
          },
        },
        include: { role: true },
      }),
      db.role.findMany(),
    ])

    res.render('teams', {
      title: 'Hivemind | Teams',
      view: 'teams',
      user,
      teams,
      roles,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    })
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const id: string = req.params.id
      const team = await db.user.findFirst({
        where: { id },
      })

      if (req.file) {
        const oldPublicPhoto = `public/images/${team!.publicPhoto}`
        access(oldPublicPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPublicPhoto)
        })
      }

      await db.user.update({
        where: { id },
        data: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          linkedin: req.body.linkedin,
          roleId: req.body.roleId,
          publicPhoto: req.file?.filename ?? team!.publicPhoto,
        },
      })

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Team was successfully updated')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/teams')
  }

  static async addTeam(req: Request, res: Response) {
    try {
      const salt: string = bcrypt.genSaltSync(8)

      await db.user.create({
        data: {
          name: req.body.name,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, salt),
          email: req.body.email,
          linkedin: req.body.linkedin,
          photo: 'default-profile.png',
          publicPhoto: req.file!.filename,
          roleId: req.body.roleId,
        },
      })

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Team was successfully added')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/teams')
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const team = await db.user.findFirst({
        where: { id },
        select: {
          photo: true,
          publicPhoto: true,
        },
      })

      if (team!.photo !== 'default-profile.png') {
        await unlink(`public/images/${team!.photo}`)
      }

      await Promise.all([
        unlink(`public/images/${team!.publicPhoto}`),
        db.user.delete({ where: { id } }),
      ])

      req.flash('alertType', 'success')
      req.flash('alertMessage', 'Team was successfully deleted')
    } catch (error: any) {
      req.flash('alertType', 'danger')
      req.flash('alertMessage', error.message)
    }

    res.redirect('/teams')
  }
}

export default TeamController
