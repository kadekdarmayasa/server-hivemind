import { db } from '../lib/server.db';

interface Service {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
}

class ServiceModel {
  static async getAllServices(): Promise<Service[] | null> {
    return db.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
      },
    });
  }

  static async getService(id: number): Promise<Service | null> {
    return db.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
      },
    });
  }

  static async addService(service: Omit<Service, 'id'>): Promise<Service | null> {
    return db.service.create({
      data: {
        name: service.name,
        description: service.description,
        thumbnail: service.thumbnail,
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
      },
    });
  }

  static async updateService(service: Service): Promise<Service> {
    return db.service.update({
      where: { id: service.id },
      data: {
        name: service.name,
        description: service.description,
        thumbnail: service.thumbnail,
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
      },
    });
  }

  static async deleteService(id: number): Promise<void> {
    await db.service.delete({ where: { id } });
  }
}

export default ServiceModel;
