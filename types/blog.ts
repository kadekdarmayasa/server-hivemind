export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string;
  thumbnail: string;
  published: boolean;
  published_at: Date | string;
  userId: number;
}
