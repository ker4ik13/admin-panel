import { User, UserDocument } from '@user/user.schema';
import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { IRole } from 'src/types/IRole';

export class UserResponse implements User {
  _id: Types.ObjectId;
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: string;

  isBlocked: boolean;

  updatedAt: string;
  roles: IRole[];
  activationLink: string;
  blockReason: string;
  isActivated: boolean;
  lastName: string;
  name: string;
  photo: string;
  telegramId: number;

  constructor(user: UserDocument) {
    this._id = user._id;
    this.email = user.email;
    this.updatedAt = user.updatedAt;
    this.roles = user.roles;
    this.activationLink = user.activationLink;
    this.blockReason = user.blockReason;
    this.lastName = user.lastName;
    this.isBlocked = user.isBlocked;
    this.name = user.name;
    this.photo = user.photo;
    this.telegramId = user.telegramId;
  }
}
