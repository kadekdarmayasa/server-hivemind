import { db } from '../lib/server.db';
import { Portfolio } from '../types/portfolio';

class PortfolioModel {
  static _selectTemplate = {
    id: true,
    name: true,
    thumbnail: true,
    orientation: true,
    serviceId: true,
  };

  static async getAllPortfolios(): Promise<Portfolio[]> {
    return db.portfolio.findMany({
      select: { ...this._selectTemplate },
    });
  }

  static async getPortfolio(id: number): Promise<Portfolio | null> {
    return db.portfolio.findUnique({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  static async addPortfolio(portfolio: Omit<Portfolio, 'id'>): Promise<Portfolio> {
    return db.portfolio.create({
      data: { ...portfolio },
      select: { ...this._selectTemplate },
    });
  }

  static async updatePortfolio(portfolio: Portfolio): Promise<Portfolio> {
    return db.portfolio.update({
      where: { id: portfolio.id },
      data: { ...(portfolio as Omit<Portfolio, 'id'>) },
      select: { ...this._selectTemplate },
    });
  }

  static async deletePortfolio(id: number): Promise<void> {
    await db.portfolio.delete({ where: { id } });
  }
}

export default PortfolioModel;
