export enum EUserRoles {
  admin = 'ROLE_ADMIN',
  user = 'ROLE_USER',
}

export interface IMessage {
  message: string;
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
  categoryName?: string;
  cost: number;
  description?: string;
  imageSrc?: string;
  name: string;
  quantity?: number;
  unit?: string;
  isDescriptionTrancated: boolean;
}

export interface IOrder {
  _id?: string;
  date?: Date;
  list?: IProductList[];
  order?: number;
  user?: string;
}

export interface IProductList {
  _id?: string;
  categoryName: string|any;
  cost: number;
  name: string;
  quantity?: number | any;
  unit?: string;imageSrc?: string;
}
