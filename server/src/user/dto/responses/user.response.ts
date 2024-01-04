import { User, UserDocument } from '@user/user.schema';
import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';

export class UserResponse implements User {
  _id: Types.ObjectId;
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  isBlocked: boolean;

  updatedAt: string;
  roles: Types.ObjectId[];
  activationLink: string;
  banReason: string;
  isActivated: boolean;
  isBanned: boolean;
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
    this.banReason = user.banReason;
    this.lastName = user.lastName;
    this.name = user.name;
    this.photo = user.photo;
    this.telegramId = user.telegramId;
  }
}
