import { db } from '../lib/server.db';
import { Testimony } from '../types/testimony';

class TestimonyModel {
  static _selectTemplate = {
    id: true,
    clientName: true,
    clientPhoto: true,
    occupation: true,
    message: true,
    rate: true,
  };

  static async getAllTestimony(): Promise<Testimony[]> {
    return db.testimony.findMany({
      select: { ...this._selectTemplate },
    });
  }

  static async getTestimony(id: number): Promise<Testimony | null> {
    return db.testimony.findUnique({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  static async addTestimony(testimony: Omit<Testimony, 'id'>): Promise<Testimony> {
    return db.testimony.create({
      data: { ...testimony },
      select: { ...this._selectTemplate },
    });
  }

  static async updateTestimony(testimony: Testimony): Promise<Testimony> {
    return db.testimony.update({
      where: { id: testimony.id },
      data: { ...(testimony as Omit<Testimony, 'id'>) },
      select: { ...this._selectTemplate },
    });
  }

  static async deleteTestimony(id: number): Promise<void> {
    await db.testimony.delete({ where: { id } });
  }
}

export default TestimonyModel;
