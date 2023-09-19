import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  pool: true,
  auth: {
    user: 'hivemindindonesia@outlook.com',
    pass: 'adminhivemind123#&561',
  },
})

export { transporter }
