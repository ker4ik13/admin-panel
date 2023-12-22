import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'Почта пользователя',
  })
  @Prop({
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'dksackxsadksnajsad',
    description: 'Пароль пользователя',
  })
  @Prop({
    required: true,
  })
  password: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  @Prop({
    required: true,
  })
  lastName: string;

  @Prop()
  photo: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Role',
    required: true,
  })
  roles: Types.ObjectId[];

  @Prop()
  isActivated: boolean;

  @Prop()
  activationLink: string;

  @ApiProperty({
    example: 'Дата ISO string',
    description: 'Дата создания аккаунта',
  })
  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop()
  isBanned: boolean;

  @Prop()
  banReason: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
