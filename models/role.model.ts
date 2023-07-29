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
}

export default RoleModel;
