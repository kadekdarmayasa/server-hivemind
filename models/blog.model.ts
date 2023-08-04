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
        published: true,
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

  static async getBlog(id: number): Promise<Blog | null> {
    return db.blog.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        coverImage: true,
        thumbnail: true,
        published: true,
        publishedAt: true,
        userId: true,
      },
    });
  }

  static async updateBlog(blog: Blog): Promise<Partial<Blog> | null> {
    return db.blog.update({
      where: { id: blog.id },
      data: { ...blog },
      select: {
        id: true,
        thumbnail: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        coverImage: true,
        published: true,
      },
    });
  }

  static async deleteBlog(id: number): Promise<void> {
    await db.blog.delete({ where: { id } });
  }

  // TODO: Make a function for handling request by slug
}

export default BlogModel;
