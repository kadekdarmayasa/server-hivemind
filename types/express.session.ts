import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      roleId: number;
    };
    blog: {
      id: number;
    }
  }
}
