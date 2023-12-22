import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;
  @MinLength(8, {
    message: 'Пароль должен состоять не менее, чем из 8 символов',
  })
  password: string;
}
