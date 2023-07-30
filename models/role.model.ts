import { db } from '../lib/server.db';
import { Role } from '../types/role';

class RoleModel {
  static async getAllRoles(): Promise<Role[]> {
    return db.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  static async getRole(id: number): Promise<Role | null> {
    return db.role.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }

  static async addRole(name: string): Promise<Role> {
    return db.role.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  static async updateRole(id: number, name: string): Promise<Role | null> {
    return db.role.update({
      where: { id },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  static async deleteRole(id: number): Promise<void> {
    await db.role.delete({
      where: { id },
    });
  }
}

export default RoleModel;
