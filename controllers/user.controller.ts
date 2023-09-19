import { Request, Response } from 'express'
import { unlink } from 'node:fs/promises'
import { access, constants } from 'node:fs'
import '../types/express.session'
import bcrypt from 'bcryptjs'
import { db } from '../lib/server.db'

class UserController {
  static async index(req: Request, res: Response) {
    const [user, role, roles] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
      }),
      db.role.findFirst({
        where: { id: req.session.user!.roleId },
      }),
      db.role.findMany(),
    ])

    res.render('profile', {
      title: 'Hivemind | User Profile',
      view: 'profile',
      roles,
      user: {
        ...user,
        email: user!.email || 'N/A',
        linkedin: user!.linkedin || 'N/A',
        role: role!.name,
      },
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    })
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      await db.user.update({
        where: {
          id: req.session.user!.id,
        },
        data: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          linkedin: req.body.linkedin,
          roleId: req.body.roleId,
        },
      })

      req.flash('alertMessage', 'Profile updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/user/profile')
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const userId: string = req.session.user!.id
      const user = await db.user.findFirst({
        where: { id: userId },
        select: { password: true },
      })

      if (!bcrypt.compareSync(req.body.currentPassword, user!.password)) {
        return res
          .status(400)
          .json({ message: 'Current password is incorrect' })
      }

      const salt = await bcrypt.genSalt(8)
      await db.user.update({
        where: { id: userId },
        data: {
          password: bcrypt.hashSync(req.body.newPassword, salt),
        },
      })
      return res.status(200).json({ message: 'Password updated successfully' })
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
      res.redirect('/user/profile')
    }
  }

  static async updatePhotoProfile(req: Request, res: Response) {
    try {
      const userId: string = req.session.user!.id
      const user = await db.user.findFirst({
        where: { id: userId },
        select: { photo: true },
      })

      if (req.file && user!.photo !== 'default-profile.png') {
        const oldPhoto = `public/images/${user!.photo}`
        access(oldPhoto, constants.F_OK, (err) => {
          if (!err) unlink(oldPhoto)
        })
      }

      await db.user.update({
        where: { id: userId },
        data: {
          photo: req.file?.filename ?? user!.photo,
        },
      })
      return res
        .status(200)
        .json({ message: 'Photo profile updated successfully' })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}

export default UserController
