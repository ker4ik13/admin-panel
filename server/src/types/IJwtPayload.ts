import { IRole } from './IRole';

export interface IJwtPayload {
  _id: string;
  email: string;
  roles: IRole[];
}
