import { db } from '../lib/server.db';

interface Subscriber {
  id: number;
  email: string;
}

class SubscriberModel {
  static _selectTemplate = {
    id: true,
    email: true,
  };

  static async getSubscriberByEmail(email: string): Promise<Subscriber | null> {
    return db.subscriber.findFirst({
      where: { email },
      select: { ...this._selectTemplate },
    });
  }

  static async getAllSubscribers(): Promise<Subscriber[]> {
    return db.subscriber.findMany({
      select: { ...this._selectTemplate },
    });
  }

  static async getSubscriber(id: number): Promise<Subscriber | null> {
    return db.subscriber.findFirst({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  static async addSubscriber(email: string): Promise<Subscriber> {
    return db.subscriber.create({
      data: { email },
      select: { ...this._selectTemplate },
    });
  }

  static async updateSubscriber({ id, email }: Subscriber): Promise<Subscriber> {
    return db.subscriber.update({
      where: { id },
      data: { email },
      select: { ...this._selectTemplate },
    });
  }

  static async deleteSubscriber(id: number): Promise<void> {
    await db.subscriber.delete({ where: { id } });
  }
}

export default SubscriberModel;
