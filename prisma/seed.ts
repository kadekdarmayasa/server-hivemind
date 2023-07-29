import { db } from '../lib/server.db';
import bcrypt from 'bcryptjs';
import { User } from '../types/user';
import { Role } from '../types/role';
import { Client } from '../types/client';
import { Testimony } from '../types/testimony';
import { Service } from '../types/service';

async function seed() {
  const users = await getUsers();
  const roles = await getRoles();
  const services = await getServices();
  const clients = await getClients();
  const testimonies = await getTestimonies();

  await db.role.createMany({ data: roles });
  await db.client.createMany({ data: clients });
  await db.service.createMany({ data: services });
  await db.testimony.createMany({ data: testimonies });

  const rolesInDb = await db.role.findMany();
  for (let i = 0; i < users.length; i++) users[i].roleId = rolesInDb[i].id;

  for (const user of users) {
    const salt = bcrypt.genSaltSync(8);
    const password = bcrypt.hashSync(user.password, salt);
    await db.user.create({ data: { ...user, password } });
  }
}

seed()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

async function getUsers(): Promise<Omit<User, 'id'>[]> {
  return [
    {
      name: 'I Kadek Darmayasa Adi Putra',
      username: 'darmayasa',
      password: 'darma123',
      roleId: 1,
      photo: 'default-profile.png',
      linkedin: 'kadekdarmayasa',
      email: 'darmayasadiputra@gmail.com',
    },
    {
      name: 'I Kadek Anggara Putra',
      username: 'anggara',
      password: 'anggara123',
      roleId: 2,
      photo: 'default-profile.png',
      linkedin: 'kadekanggara',
      email: 'kadekanggara@gmail.com',
    },
  ];
}

async function getRoles(): Promise<Omit<Role, 'id'>[]> {
  return [
    {
      name: 'Admin',
    },
    {
      name: 'Content Creator',
    },
  ];
}

async function getClients(): Promise<Omit<Client, 'id'>[]> {
  return [
    {
      name: 'Amazon',
      logo: 'clientLogo-1689645227289.png',
    },
    {
      name: 'Apple',
      logo: 'clientLogo-1689645237712.png',
    },
    {
      name: 'Behance',
      logo: 'clientLogo-1689645248549.png',
    },
    {
      name: 'Dribbble',
      logo: 'clientLogo-1689645261165.png',
    },
    {
      name: 'Dropbox',
      logo: 'clientLogo-1689645274965.png',
    },
    {
      name: 'Google',
      logo: 'clientLogo-1689645287644.png',
    },
    {
      name: 'Paypal',
      logo: 'clientLogo-1689645297158.png',
    },
    {
      name: 'Slack',
      logo: 'clientLogo-1689645305707.png',
    },
  ];
}

async function getTestimonies(): Promise<Omit<Testimony, 'id'>[]> {
  return [
    {
      clientName: 'Max Robinson',
      clientPhoto: 'clientPhoto-1689729448928.png',
      occupation: 'Entrepreneur',
      message:
        'The team at this company is truly professional and skilled. They created a beautiful website for my business and helped me improve my SEO ranking. I will definitely work with them again.',
      rate: 3,
    },
    {
      clientName: 'Olivia Taylor',
      clientPhoto: 'clientPhoto-1689729847947.png',
      occupation: 'Creative Director',
      message:
        'Working with this company was a pleasure. They have a great eye for design and are able to execute projects quickly and efficiently. I would definitely recommend them to anyone looking for high-quality graphic design.',
      rate: 5,
    },
    {
      clientName: 'Robert Johnson',
      clientPhoto: 'clientPhoto-1689729870565.jpg',
      occupation: 'CEO',
      message:
        "The results speak for themselves. Since partnering with Hivemind, we've seen a significant increase in website traffic and lead generation. Their team's expertise and creativity have been invaluable to our digital marketing efforts.",
      rate: 5,
    },
    {
      clientName: 'Sarah Lee',
      clientPhoto: 'clientPhoto-1689729882182.png',
      occupation: 'E-commerce Manager',
      message:
        "Working with Hivemind has been a game-changer for our online store. Their e-commerce expertise has helped us streamline our sales process and optimize our website for maximum conversion. We couldn't be happier with the results.",
      rate: 5,
    },
    {
      clientName: 'John Smith',
      clientPhoto: 'clientPhoto-1689729891385.png',
      occupation: 'Marketing Manager',
      message:
        'I am very impressed with the quality of service and attention to detail provided by this company. They helped us increase our online presence and attract more customers. Highly recommended!',
      rate: 4.2,
    },
    {
      clientName: 'Maria Garcia',
      clientPhoto: 'clientPhoto-1689729901641.png',
      occupation: 'Real Estate Agent',
      message:
        "I've worked with several web design companies in the past, but none have delivered the same level of expertise and customer service as Hivemind. Their team took the time to understand my business and goals and created a website that truly reflects my brand. I would highly recommend their services.",
      rate: 4.5,
    },
  ];
}

async function getServices(): Promise<Omit<Service, 'id'>[]> {
  return [
    {
      name: 'Web Design',
      thumbnail: 'thumbnail-1689734259611.svg',
      description:
        'Our team of expert designers creates visually stunning websites that are easy to navigate and optimized for conversion.',
    },
    {
      name: 'Search Engine Optimization',
      thumbnail: 'thumbnail-1689734296404.svg',
      description:
        'Our SEO specialists help you climb the rankings and increase visibility with proven techniques that drive organic traffic.',
    },
    {
      name: 'Social Media Marketing',
      thumbnail: 'thumbnail-1689734323485.svg',
      description:
        'We develop customized social media strategies that drive engagement, increase followers, and ultimately boost your business.',
    },
    {
      name: 'Content Creation',
      thumbnail: 'thumbnail-1689734349437.svg',
      description:
        'We create compelling, informative content that engages your audience and establishes your brand as an authority.',
    },
    {
      name: 'E-commerce Solutions',
      thumbnail: 'thumbnail-1689734370520.svg',
      description:
        'We help you develop and optimize your online store, making it easy for customers to browse, shop, and checkout with confidence.',
    },
    {
      name: 'Mobile App Development',
      thumbnail: 'thumbnail-1689734394304.svg',
      description:
        'Our experienced team of developers creates user-friendly, responsive apps that take your business to the next level.',
    },
  ];
}
