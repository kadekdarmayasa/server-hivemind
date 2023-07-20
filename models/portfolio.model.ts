import { db } from '../lib/server.db';

interface Portfolio {
  id: number;
  name: string;
  thumbnail: string;
  orientation: string;
  serviceId: number;
}

class PortfolioModel {
  static async getAllPortfolios(): Promise<Portfolio[]> {
    return db.portfolio.findMany({
      select: {
        id: true,
        name: true,
        thumbnail: true,
        orientation: true,
        serviceId: true,
      },
    });
  }

  static async getPortfolio(id: number): Promise<Portfolio | null> {
    return db.portfolio.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        orientation: true,
        serviceId: true,
      },
    });
  }

  static async addPortfolio(portfolio: Omit<Portfolio, 'id'>): Promise<Portfolio> {
    return db.portfolio.create({
      data: { ...portfolio },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        orientation: true,
        serviceId: true,
      },
    });
  }

  static async updatePortfolio(portfolio: Portfolio): Promise<Portfolio | null> {
    return db.portfolio.update({
      where: { id: portfolio.id },
      data: { ...(portfolio as Omit<Portfolio, 'id'>) },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        orientation: true,
        serviceId: true,
      },
    });
  }

  static async deletePortfolio(id: number): Promise<void> {
    await db.portfolio.delete({ where: { id } });
  }
}

export default PortfolioModel;
