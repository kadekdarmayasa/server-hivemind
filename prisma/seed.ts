import { db } from '../lib/server.db';
import bcrypt from 'bcryptjs';

type User = {
  name: string;
  username: string;
  password: string;
  roleId: number;
  photo: string;
};

type Role = {
  name: string;
};

async function seed() {
  const users = await getUsers();
  const roles = await getRoles();
  const salt = await bcrypt.genSalt(8);

  for (const role of roles) {
    await db.role.create({
      data: role,
    });
  }

  for (const user of users) {
    await db.user.create({
      data: {
        ...user,
        password: await bcrypt.hash(user.password, salt),
      },
    });
  }
}

seed();

async function getUsers(): Promise<User[]> {
  return [
    {
      name: 'I Kadek Darmayasa Adi Putra',
      username: 'darmayasa',
      password: 'darma123',
      roleId: 1,
      photo: 'default-profile.png',
    },
    {
      name: 'I Kadek Anggara Putra',
      username: 'anggara',
      password: 'anggara123',
      roleId: 2,
      photo: 'default-profile.png',
    },
  ];
}

async function getRoles(): Promise<Role[]> {
  return [
    {
      name: 'Admin',
    },
    {
      name: 'Content Creator',
    },
  ];
}
