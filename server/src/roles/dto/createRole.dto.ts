import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @MinLength(1)
  @IsString()
  @ApiProperty({
    example: 'ADMIN',
    description: 'Роль пользователя',
  })
  readonly value: string;

  @MinLength(1)
  @IsString()
  @ApiProperty({
    example: 'Администратор',
    description: 'Описание роли',
  })
  readonly label: string;
}
