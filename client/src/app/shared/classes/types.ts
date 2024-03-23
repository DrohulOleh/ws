export enum EUserRoles {
  admin = 'ROLE_ADMIN',
  user = 'ROLE_USER',
}

export interface IUser {
  email: string;
  password: string;
}

export interface ICategory {
  _id?: string;
  imageSrc?: string;
  name: string;
  user?: string;
}

export interface IProduct {
  _id?: string;
  category: string;
  cost: number;
  name: string;
  quantity?: number;
}