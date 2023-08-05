import express from 'express';
import { Subscriber } from '../types/subscriber';
import { Blog } from '../types/blog';
import { transporter } from './nodemailer.transport';
import { createEmailTemplate } from '../src/templates/template-creator';

async function notifySubcribers(subscribers: Array<Subscriber>, blog: Blog): Promise<void> {
  try {
    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: 'hivemindindonesia@outlook.com',
        to: subscriber.email,
        subject: `New Blog Post - ${blog!.title}`,
        html: createEmailTemplate({
          blogTitle: blog!.title,
          blogDescription: blog!.description,
          blogThumbnail: blog!.thumbnail,
        }),
      });
    }
  } catch (error) {
    express.Router().use((...args) => {
      const req = args[0];
      const res = args[1];

      req.flash('alertMessage', 'Failed to send email');
      req.flash('alertType', 'danger');
      res.redirect('/user/blogs');
    });
  }
}

export { notifySubcribers };
