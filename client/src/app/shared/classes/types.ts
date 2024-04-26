export enum EUserRoles {
  admin = 'ROLE_ADMIN',
  user = 'ROLE_USER',
}

export enum EOrserStatus {
  canceled = 'CANCELED',
  delivered = 'DELIVERED',
  new = 'NEW',
  processing = 'PROCESSING',
  ready = 'READY',
}

export enum EUnitOfMeasurement {
  gram = 'GRAM',
  kilogram = 'KILOGRAM',
  liter = 'LITER',
  milliliter = 'MILLILITER',
  pcs = 'PCS',
  box20gram = 'BOX 20 GRAM',
}

export interface IMessage {
  message: string;
}

export interface IUser {
  _id: string | undefined;
  deliveryAddress?: string[];
  email: string;
  isRegistrationComplete: boolean;
  name?: string;
  password: string;
  role: EUserRoles;
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
  isDescriptionTrancated?: boolean;
}

export interface ICart {
  user: string;
  list: IProductList[];
}

export interface IOrder {
  _id?: string;
  date?: Date;
  list?: IProductList[];
  order?: number;
  user?: string;
  name?: string;
}

export interface IProductList {
  _id?: string;
  categoryName: string | any;
  cost: number;
  imageSrc?: string;
  name: string;
  quantity?: number | any;
  unit?: string;
}
