import { db } from '../lib/server.db';
import { Client } from '../types/client';

class ClientModel {
  static _selectTemplate = {
    id: true,
    logo: true,
    name: true,
  };

  static async getAllClients(): Promise<Client[]> {
    return db.client.findMany({
      select: { ...this._selectTemplate },
    });
  }

  static async getClient(id: number): Promise<Client | null> {
    return db.client.findFirst({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  static async addClient({ logo, name }: Omit<Client, 'id'>): Promise<Client> {
    return db.client.create({
      data: { logo, name },
      select: { ...this._selectTemplate },
    });
  }

  static async deleteClient(id: number): Promise<void> {
    await db.client.delete({ where: { id } });
  }
}

export default ClientModel;
