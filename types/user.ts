export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  roleId: number;
  roleName?: string;
  photo: string | null;
  public_photo: string | null;
  email: string | null;
  linkedin: string | null;
}
