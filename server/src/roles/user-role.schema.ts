import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';
import { User } from 'src/user/user.schema';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema()
export class UserRole {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  })
  roleId: Role;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
