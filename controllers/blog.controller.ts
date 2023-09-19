import { db } from '../lib/server.db'
import { CustomFiles } from '../types/custom.files'
import { Request, Response } from 'express'
import { isFilesEmpty } from '../lib/multer.files'
import { access, constants } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { notifySubcribers } from '../lib/notify.subscriber'

class BlogController {
  static async index(req: Request, res: Response) {
    const [user, services, blogs] = await Promise.all([
      db.user.findFirst({
        where: { id: req.session.user!.id },
        include: { role: true },
      }),
      db.service.findMany(),
      db.blog.findMany(),
    ])

    res.render('blogs', {
      title: 'Hivemind | Blogs',
      view: 'blog',
      user,
      blogs,
      services,
      alert: {
        message: req.flash('alertMessage'),
        type: req.flash('alertType'),
      },
    })
  }

  static async addBlog(req: Request, res: Response) {
    try {
      const files = req.files as CustomFiles

      await db.blog.create({
        data: {
          title: req.body.title,
          slug: req.body.slug + '-' + Date.now(),
          description: req.body.description,
          content: req.body.content,
          thumbnail: files['blogThumbnail'][0].filename,
          coverImage: files['coverImage'][0].filename,
          published: false,
          publishedAt: new Date(),
          authorId: req.session.user!.id,
        },
      })

      req.flash('alertMessage', 'Blog added successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/blogs')
  }

  static async updateBlogView(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const [user, services, blog] = await Promise.all([
        db.user.findFirst({
          where: { id: req.session.user!.id },
        }),
        db.service.findMany(),
        db.blog.findFirst({
          where: { id },
        }),
      ])

      res.render('blogs', {
        title: 'Hivemind | Blogs',
        view: 'blog/update',
        user,
        blog,
        services,
        alert: {
          message: req.flash('alertMessage'),
          type: req.flash('alertType'),
        },
      })
    } catch (err: any) {
      req.flash('alertMessage', err.message)
      req.flash('alertType', 'danger')
      res.redirect('/blogs')
    }
  }

  static async updateBlog(req: Request, res: Response) {
    try {
      const files = req.files as CustomFiles
      const blogThumbnail = files['blogThumbnail']
      const coverImage = files['coverImage']
      const id: string = String(req.params.id)
      const blog = await db.blog.findFirst({ where: { id } })

      if (!isFilesEmpty(files)) {
        const oldThumbnail = `public/images/${blog!.thumbnail}`
        const oldCoverImage = `public/images/${blog!.coverImage}`

        access(oldThumbnail, constants.F_OK, (err) => {
          if (!err) unlink(oldThumbnail)
        })

        access(oldCoverImage, constants.F_OK, (err) => {
          if (!err) unlink(oldCoverImage)
        })
      }

      await db.blog.update({
        where: { id },
        data: {
          title: req.body.title,
          slug: req.body.slug,
          description: req.body.description,
          content: req.body.content,
          thumbnail: blogThumbnail
            ? blogThumbnail[0].filename
            : blog!.thumbnail,
          coverImage: coverImage ? coverImage[0].filename : blog!.coverImage,
          published: blog!.published,
          publishedAt: blog!.published ? blog!.publishedAt : new Date(),
          authorId: blog!.authorId,
        },
      })

      req.flash('alertMessage', 'Blog updated successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect(`/blogs/update/${req.params.id}`)
  }

  static async deleteBlog(req: Request, res: Response) {
    try {
      const id: string = String(req.params.id)
      const blog = await db.blog.findFirst({
        where: { id },
      })

      await Promise.all([
        unlink(`public/images/${blog!.thumbnail}`),
        unlink(`public/images/${blog!.coverImage}`),
        db.blog.delete({
          where: { id },
        }),
      ])

      req.flash('alertMessage', 'Blog deleted successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/blogs')
  }

  static async publishBlog(req: Request, res: Response) {
    try {
      const id: string = String(req.body.id)
      const blog = await db.blog.findFirst({
        where: { id },
      })

      await db.blog.update({
        where: { id },
        data: {
          title: blog!.title,
          slug: blog!.slug,
          description: blog!.description,
          content: blog!.content,
          thumbnail: blog!.thumbnail,
          coverImage: blog!.coverImage,
          published: true,
          publishedAt: new Date(),
          authorId: blog!.authorId,
        },
      })

      const subscribers = await db.subscriber.findMany()
      notifySubcribers(subscribers, blog!)

      req.flash('alertMessage', 'Blog published successfully')
      req.flash('alertType', 'success')
    } catch (error: any) {
      req.flash('alertMessage', error.message)
      req.flash('alertType', 'danger')
    }

    res.redirect('/blogs')
  }
}

export default BlogController
