import express from 'express'
import { body } from 'express-validator'
import BlogController from '../controllers/blog.controller'
import auth from '../middlewares/auth.middleware'
import * as multer from '../middlewares/multer.middleware'
import { processUpload } from '../middlewares/upload.middleware'

export const blogRouter = express.Router()

blogRouter.use(auth)
blogRouter.get('/', BlogController.index)
blogRouter.post(
  '/',
  body('title').trim(),
  body('slug').trim(),
  body('description').trim(),
  body('content').trim(),
  processUpload(
    multer.upload.fields([
      {
        name: 'blogThumbnail',
      },
      {
        name: 'coverImage',
      },
    ]),
    '/blogs'
  ),
  BlogController.addBlog
)
blogRouter.put(
  '/update/:id',
  body('title').trim(),
  body('slug').trim(),
  body('description').trim(),
  body('content').trim(),
  processUpload(
    multer.upload.fields([
      {
        name: 'blogThumbnail',
      },
      {
        name: 'coverImage',
      },
    ]),
    '/blogs'
  ),
  BlogController.updateBlog
)
blogRouter.get('/update/:id', BlogController.updateBlogView)
blogRouter.delete('/:id', BlogController.deleteBlog)
blogRouter.put('/publish', BlogController.publishBlog)
