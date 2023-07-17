import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import path from 'path';

import { indexRouter } from './routes/index.route';
import { adminRouter } from './routes/admin.route';
import { authRouter } from './routes/auth.route';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + 86400000),
      maxAge: 86400000,
    },
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
  '/sb-admin-2',
  express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')),
);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
