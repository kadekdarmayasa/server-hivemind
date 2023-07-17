import { db } from '../lib/server.db';

interface ReadSubscriber {
  id: number;
  email: string;
}

class SubscriberModel {
  static async getSubscriberByEmail(email: string): Promise<ReadSubscriber | null> {
    return db.subscriber.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  static async getAllSubscribers(): Promise<ReadSubscriber[]> {
    return db.subscriber.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  static async getSubscriber(id: number): Promise<ReadSubscriber | null> {
    return db.subscriber.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  static async addSubscriber(email: string): Promise<ReadSubscriber | null> {
    return db.subscriber.create({
      data: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  static async deleteSubscriber(id: number): Promise<ReadSubscriber | null> {
    return db.subscriber.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  static async updateSubscriber(id: number, email: string): Promise<ReadSubscriber | null> {
    return db.subscriber.update({
      where: {
        id: id,
      },
      data: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }
}

export default SubscriberModel;
