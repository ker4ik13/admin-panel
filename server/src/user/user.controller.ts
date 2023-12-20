import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { Response } from 'express';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import UserDto from 'src/user/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.auth.decorator';
import { UserRoles } from 'src/types/UserRoles';
import { RolesGuard } from 'src/auth/roles.guard';

// TODO: разобраться с авторизацией
@ApiTags('Пользователи')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получение всех пользователей
  @ApiOperation({
    summary: `Получение всех пользователей. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiResponse({ status: 200, type: [UserDto] })
  @Roles(UserRoles.Creator, UserRoles.Admin)
  @UseGuards(RolesGuard)
  @Get('users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Получение пользователя по ID
  @ApiOperation({
    summary: `Получение пользователя по ID. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Недостаточно прав',
  })
  @Roles(UserRoles.Admin, UserRoles.Creator)
  @UseGuards(RolesGuard)
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  // Удаление пользователя по ID
  @ApiOperation({ summary: 'Удаление пользователя по ID' })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, type: UserDto })
  @Delete('users/:id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // Изменение пользователя по ID
  @ApiOperation({ summary: 'Изменение пользователя по ID' })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 204, type: UserDto })
  @Patch('users/:id')
  updateUserById(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }

  // TODO: доделать выдачу ролей
  // Выдать роль пользователю
  @ApiOperation({ summary: 'Выдать роль пользователю' })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @Roles(UserRoles.Creator, UserRoles.Admin)
  @ApiResponse({ status: 200 })
  @Patch('users/:id')
  addRole(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }
}
