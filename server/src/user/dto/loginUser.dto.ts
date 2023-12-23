import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'youremail@gmail.com',
    description: 'Электронная почта / логин',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    example: 'dasdusakdsada',
    description: 'Пароль',
  })
  @MinLength(8, {
    message: 'Пароль должен состоять не менее, чем из 8 символов',
  })
  password: string;
}
