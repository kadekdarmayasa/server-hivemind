import { db } from '../lib/server.db';

interface Testimony {
  id: number;
  clientName: string;
  clientPhoto: string;
  occupation: string;
  message: string;
  rate: number;
}

class TestimonyModel {
  static async getAllTestimony(): Promise<Testimony[] | null> {
    return db.testimony.findMany({
      select: {
        id: true,
        clientName: true,
        clientPhoto: true,
        occupation: true,
        message: true,
        rate: true,
      },
    });
  }

  static async getTestimony(id: number): Promise<Testimony | null> {
    return db.testimony.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        clientName: true,
        clientPhoto: true,
        occupation: true,
        message: true,
        rate: true,
      },
    });
  }

  static async addTestimony(testimony: Omit<Testimony, 'id'>): Promise<Testimony | null> {
    return db.testimony.create({
      data: {
        clientName: testimony.clientName,
        clientPhoto: testimony.clientPhoto,
        occupation: testimony.occupation,
        message: testimony.message,
        rate: testimony.rate,
      },
      select: {
        id: true,
        clientName: true,
        clientPhoto: true,
        occupation: true,
        message: true,
        rate: true,
      },
    });
  }

  static async updateTestimony(testimony: Testimony): Promise<Testimony | null> {
    return db.testimony.update({
      where: {
        id: testimony.id,
      },
      data: {
        clientName: testimony.clientName,
        clientPhoto: testimony.clientPhoto,
        occupation: testimony.occupation,
        message: testimony.message,
        rate: testimony.rate,
      },
      select: {
        id: true,
        clientName: true,
        clientPhoto: true,
        occupation: true,
        message: true,
        rate: true,
      },
    });
  }

  static async deleteTestimony(id: number): Promise<void> {
    await db.testimony.delete({ where: { id } });
  }
}

export default TestimonyModel;
