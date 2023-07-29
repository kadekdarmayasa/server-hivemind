import { db } from '../lib/server.db';
import { Service } from '../types/service';

class ServiceModel {
  static _selectTemplate = {
    id: true,
    name: true,
    description: true,
    thumbnail: true,
  };

  static async getAllServices(): Promise<Service[]> {
    return db.service.findMany({
      select: { ...this._selectTemplate },
    });
  }

  static async getService(id: number): Promise<Service | null> {
    return db.service.findUnique({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  static async addService(service: Omit<Service, 'id'>): Promise<Service> {
    return db.service.create({
      data: { ...service },
      select: { ...this._selectTemplate },
    });
  }

  static async updateService(service: Service): Promise<Service> {
    return db.service.update({
      where: { id: service.id },
      data: { ...(service as Omit<Service, 'id'>) },
      select: { ...this._selectTemplate },
    });
  }

  static async deleteService(id: number): Promise<void> {
    await db.service.delete({ where: { id } });
  }
}

export default ServiceModel;
