import { db } from '../lib/server.db';
import { User } from '../types/user';

class UserModel {
  static _selectTemplate = {
    id: true,
    name: true,
    username: true,
    password: true,
    roleId: true,
    photo: true,
    email: true,
    public_photo: true,
    linkedin: true,
  };

  static async getUserByUsername(username: string): Promise<User | null> {
    return db.user.findFirst({
      where: { username },
      select: { ...this._selectTemplate },
    });
  }

  static async getUser(id: number): Promise<User | null> {
    return db.user.findFirst({
      where: { id },
      select: { ...this._selectTemplate },
    });
  }

  /**
   *
   * @param id - id of exclude user
   */
  static async getUsers(id?: number): Promise<User[]> {
    if (!id) return db.user.findMany({ select: { ...this._selectTemplate } });

    return db.user.findMany({
      where: {
        id: {
          not: id,
        },
      },
      select: { ...this._selectTemplate },
    });
  }

  static async addUser(user: Omit<User, 'id'>): Promise<User> {
    return db.user.create({
      data: { ...user },
      select: { ...this._selectTemplate },
    });
  }

  static async updateUser(user: Partial<User>): Promise<User> {
    return db.user.update({
      where: { id: user.id },
      data: { ...(user as Omit<User, 'id' | 'photo' | 'password'>) },
      select: { ...this._selectTemplate },
    });
  }

  static async updatePhotoProfile(id: number, photo: string): Promise<User> {
    return db.user.update({
      where: { id },
      data: { photo },
      select: { ...this._selectTemplate },
    });
  }

  static async updatePassword(id: number, password: string): Promise<User> {
    return db.user.update({
      where: { id },
      data: { password },
      select: { ...this._selectTemplate },
    });
  }

  static async deleteUser(id: number): Promise<void> {
    await db.user.delete({
      where: { id },
    });
  }
}

export default UserModel;
