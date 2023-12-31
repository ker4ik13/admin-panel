import { IRole } from './IRole';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  photo?: string;
  roles: IRole[];
  isActivated: boolean;
  activationLink?: string;
  createdAt: string;
  isBanned?: boolean;
  banReason?: string;
}
