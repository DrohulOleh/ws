export enum EUserRoles {
  admin = 'ROLE_ADMIN',
  user = 'ROLE_USER',
}

export interface GENERIC_KEY_VALUE_INTERFACE {
  [key: string]: any;
}

export interface IMessage {
  message: string;
}

export interface IUser {
  email: string;
  password: string;
  role: string;
  isRegistrationComplete: boolean;
}
