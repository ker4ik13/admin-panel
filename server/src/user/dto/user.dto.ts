import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { type IRole } from 'src/types/IRole';
import type { IUser } from '../../types/IUser';

export default class UserDto {
  @ApiProperty({
    example: 'dsaudysadsydsa6dt56dsad6atsd67as',
    description: 'Уникальный ID пользователя',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'Почта пользователя',
  })
  email: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  name: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  lastName: string;

  @ApiProperty({
    example: 'false',
    description: 'Активированный аккаунт',
  })
  isActivated: boolean;

  @ApiProperty({
    example: 'dsaudysadsydsa6dt56dsad6atsd67as',
    description: 'Ссылка для активации аккаунта',
  })
  activationLink?: string;

  @ApiProperty({
    example: '2023-12-20T15:09:55.204Z',
    description: 'Дата создания аккаунта',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-12-20T15:09:55.204Z',
    description: 'Дата последнего изменения аккаунта',
  })
  updatedAt?: string;

  @ApiProperty({
    example: '13762742',
    description: 'ID Telegram аккаунта',
  })
  telegramId?: string;

  @ApiProperty({
    example: [
      {
        value: 'ADMIN',
        label: 'Администратор',
      },
      {
        value: 'USER',
        label: 'Пользователь',
      },
    ],
    description: 'Роли пользователя',
  })
  roles: IRole[];

  constructor(model: IUser | any) {
    this.email = model.email;
    this._id = model._id;
    this.name = model.name;
    this.lastName = model.lastName;
    this.isActivated = model.isActivated;
    this.activationLink = model.activationLink || undefined;
    this.createdAt = new Date().toISOString();
  }
}
