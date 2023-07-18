import { db } from '../lib/server.db';

interface Client {
  id: number;
  logo: string;
  name: string;
}

class ClientModel {
  static async getAllClients(): Promise<Client[]> {
    return db.client.findMany({
      select: {
        id: true,
        logo: true,
        name: true,
      },
    });
  }

  static async getClient(id: number): Promise<Client | null> {
    return db.client.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        logo: true,
        name: true,
      },
    });
  }

  static async addClient(client: Omit<Client, 'id'>): Promise<Client> {
    return db.client.create({
      data: {
        logo: client.logo,
        name: client.name,
      },
      select: {
        id: true,
        logo: true,
        name: true,
      },
    });
  }

  static async deleteClient(id: number): Promise<void> {
    await db.client.delete({
      where: { id },
    });
  }
}

export default ClientModel;
