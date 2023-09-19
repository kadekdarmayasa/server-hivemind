import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import flash from 'connect-flash'
import path from 'path'

import { indexRouter } from './routes/index.route'
import { userRouter } from './routes/user.route'
import { authRouter } from './routes/auth.route'
import { blogRouter } from './routes/blog.route'
import { errorRouter } from './routes/error.route'
import { apiRouter } from './routes/api.route'
import { dashboardRouter } from './routes/dashboard.route'
import { teamRouter } from './routes/team.route'
import { roleRouter } from './routes/role.route'
import { subscriberRouter } from './routes/subscriber.route'
import { faqRouter } from './routes/faq.route'
import { clientRouter } from './routes/client.route'
import { testimonyRouter } from './routes/testimony.route'
import { portfolioRouter } from './routes/portfolio.route'
import { serviceRouter } from './routes/service.route'

dotenv.config()

if (!process.env.PORT) {
  process.exit(1)
}

export const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(cors())
app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + 86400000),
      maxAge: 86400000,
    },
  })
)
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(
  '/sb-admin-2',
  express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2'))
)
app.use(
  '/cropper',
  express.static(path.join(__dirname, 'node_modules/cropperjs/dist'))
)

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/dashboard', dashboardRouter)
app.use('/teams', teamRouter)
app.use('/roles', roleRouter)
app.use('/services', serviceRouter)
app.use('/portfolios', portfolioRouter)
app.use('/clients', clientRouter)
app.use('/blogs', blogRouter)
app.use('/user', userRouter)
app.use('/testimonies', testimonyRouter)
app.use('/faqs', faqRouter)
app.use('/subscribers', subscriberRouter)
app.use('/api/v1', apiRouter)
app.use(errorRouter)

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
