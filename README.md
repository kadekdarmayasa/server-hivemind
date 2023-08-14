# Server Hivemind

## Overview 🚀

This is a server for Hivemind Platform, where was built using:

- ExpressJS: NodeJS Framework for managing route and middleware.
- Prisma: Typescript ORM - data modeling
- Nodemon: Auto Restart Feature for NodeJS
- MYSQL Database
- TypeScript

## Setup & Configuration ⚙️

Before going forward, please make sure that you have `nodemon` and `nodejs` installed locally on your OS. If all are set, then you good to go ⬇️

1. Open PHPMyAdmin and Add New Database Named `hivemind`
2. Follow the instructions below for cloning and installation:

```
  > git clone https://github.com/kadekdarmayasa/server-hivemind.git
  > cd server-hivemind
  > npm install
```

3. Add new `.env` file in the root directory with the following keys and give the corresponding values:

```
  PORT=8000
  SESSION_SECRET=[random string]
  DATABASE_URL="mysql://username:password@localhost/hivemind"
```

4. Push prisma schema and run seeder command.

```
  > npm run db-push
  > npm run db-seed
```

5. Start development server and type `localhost:8000` on your favorite browser

```
  > npm run start
```

6. [Continue setup frontend](https://github.com/kadekdarmayasa/hivemind)

## GET IN TOUCH WITH ME ✌️

- Email: [darmayasadiputra@gmail.com](mailto:darmayasadiputra@gmail.com)
- Linkedin: [kadekdarmayasa](https://linkedin.com/in/kadekdarmayasa)
