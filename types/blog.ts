export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  thumbnail: string;
  published: boolean;
  publishedAt: Date | string;
  userId: number;
}
