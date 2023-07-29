import { db } from '../lib/server.db';
import { FAQ } from '../types/faq';

class FAQModel {
  static _selectTemplate = {
    id: true,
    question: true,
    answer: true,
  };

  static async getAllFAQs(): Promise<FAQ[]> {
    return db.fAQ.findMany({
      select: { ...this._selectTemplate },
    });
  }

  static async getFAQ(id: number): Promise<FAQ | null> {
    return db.fAQ.findFirst({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  static async updateFAQ({ id, question, answer }: FAQ): Promise<FAQ> {
    return db.fAQ.update({
      where: { id },
      data: { question, answer },
      select: { ...this._selectTemplate },
    });
  }

  static async addFAQ({ question, answer }: Omit<FAQ, 'id'>): Promise<FAQ> {
    return db.fAQ.create({
      data: { question, answer },
      select: { ...this._selectTemplate },
    });
  }

  static async deleteFAQ(id: number): Promise<void> {
    await db.fAQ.delete({ where: { id } });
  }
}

export default FAQModel;
