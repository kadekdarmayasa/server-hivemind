import { db } from '../lib/server.db';

type User = {
  name: string;
  username: string;
  password: string;
  roleId: number;
};

type Role = {
  name: string;
};

async function seed() {
  const users = await getUsers();
  const roles = await getRoles();

  for (const role of roles) {
    await db.role.create({
      data: role,
    });
  }

  for (const user of users) {
    await db.user.create({
      data: user,
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
    },
    {
      name: 'I Kadek Anggara Putra',
      username: 'anggara',
      password: 'anggara123',
      roleId: 2,
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
