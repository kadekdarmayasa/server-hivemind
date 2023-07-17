import { db } from '../lib/server.db';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

class FAQModel {
  static async getAllFAQs(): Promise<FAQ[]> {
    return db.fAQ.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
  }

  static async getFAQ(id: number): Promise<FAQ | null> {
    return db.fAQ.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
  }

  static async updateFAQ(faq: FAQ): Promise<FAQ> {
    const { id, question, answer } = faq;

    return db.fAQ.update({
      where: {
        id: id,
      },
      data: {
        question: question,
        answer: answer,
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
  }

  static async addFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const { question, answer } = faq;

    return db.fAQ.create({
      data: {
        question: question,
        answer: answer,
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
  }

  static async deleteFAQ(id: number): Promise<void> {
    await db.fAQ.delete({
      where: {
        id,
      },
    });
  }
}

export default FAQModel;
