import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export default class RegisterUserDto {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'Почта пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({
    example: 'dksackxsadksnajsad',
    description: 'Пароль пользователя',
  })
  @MinLength(8, {
    message: 'Длина пароля должна состоять не менее, чем из 8 символов',
  })
  readonly password: string;

  @MinLength(2, {
    message: 'Имя должно состоять не менее, чем из 2 символов',
  })
  @IsString({
    message: 'Имя должно состоять из букв',
  })
  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  readonly name: string;

  @IsString({
    message: 'Фамилия должна состоять из букв',
  })
  @MinLength(2, {
    message: 'Фамилия должна состоять не менее, чем из 2 символов',
  })
  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  readonly lastName: string;
  readonly createdAt: string = new Date().toISOString();
}
