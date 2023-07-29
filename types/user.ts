export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  roleId: number;
  photo: string | null;
  email: string | null;
  linkedin: string | null;
}
