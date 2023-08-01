import { db } from '../lib/server.db';
import { Blog } from '../types/blog';

class BlogModel {
  static async getAllBlogs(): Promise<Partial<Blog>[]> {
    return db.blog.findMany({
      select: {
        id: true,
        thumbnail: true,
        title: true,
        slug: true,
        description: true,
      },
    });
  }

  static async addBlog(blog: Omit<Blog, 'id'>): Promise<Partial<Blog>> {
    return db.blog.create({
      data: { ...blog },
      select: {
        id: true,
        thumbnail: true,
        title: true,
        slug: true,
        description: true,
      },
    });
  }

  // static async getBlogBySlug(slug: string): Promise<Partial<Blog> | null> {
  //   return db.blog.findFirst({
  //     where: { slug },
  //     select: {
  //       id: true,
  //       thumbnail: true,
  //       title: true,
  //       slug: true,
  //       description: true,
  //     },
  //   });
  // }
}

export default BlogModel;
