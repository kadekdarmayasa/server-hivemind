import { Request, Response, NextFunction, RequestHandler } from 'express';

function processUpload(uploader: RequestHandler<any>, redirectTo: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    uploader(req, res, function (err: any) {
      if (err) {
        req.flash('alertMessage', err.message);
        req.flash('alertType', 'danger');
        return res.redirect(redirectTo);
      }
      next();
    });
  };
}

export { processUpload };
