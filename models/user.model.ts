import { db } from '../lib/server.db';

interface ReadUser {
  id: number;
  name?: string;
  username: string;
  password: string;
  roleId: number;
  photo?: string | null;
}

class UserModel {
  static async getUserByUsername(username: string): Promise<ReadUser | null> {
    return db.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        roleId: true,
      },
    });
  }

  static async getUser(id: number): Promise<ReadUser | null> {
    return db.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
        roleId: true,
        photo: true,
      },
    });
  }
}

export default UserModel;
