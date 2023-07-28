import { db } from '../lib/server.db';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  roleId: number;
  photo: string | null;
  email: string | null;
  linkedin: string | null;
}

class UserModel {
  static _selectTemplate = {
    id: true,
    name: true,
    username: true,
    password: true,
    roleId: true,
    photo: true,
    email: true,
    linkedin: true,
  };

  static async getUserByUsername(username: string): Promise<User | null> {
    return db.user.findFirst({
      where: {
        username: username,
      },
      select: { ...this._selectTemplate },
    });
  }

  static async getUser(id: number): Promise<User | null> {
    return db.user.findFirst({
      where: {
        id: id,
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

  static async updateUser(user: Omit<User, 'photo'>): Promise<User> {
    return db.user.update({
      where: {
        id: user.id,
      },
      data: { ...(user as Omit<User, 'id' | 'photo'>) },
      select: { ...this._selectTemplate },
    });
  }

  static async updatePhotoProfile(id: number, photo: string): Promise<User> {
    return db.user.update({
      where: {
        id: id,
      },
      data: {
        photo: photo,
      },
      select: { ...this._selectTemplate },
    });
  }

  // TODO: add updateUserPassword method

  static async deleteUser(id: number): Promise<void> {
    await db.user.delete({
      where: {
        id: id,
      },
    });
  }
}

export default UserModel;
