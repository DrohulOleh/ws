export enum EUserRoles {
  admin = 'ROLE_ADMIN',
  user = 'ROLE_USER',
}

export interface IUser {
  email: string;
  password: string;
}
