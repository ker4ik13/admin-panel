import { CurrentUser } from '@auth/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IJwtPayload } from 'src/types/IJwtPayload';
import { IRole } from 'src/types/IRole';
import { UserRoles } from 'src/types/UserRoles';
import UserDto from 'src/user/dto/user.dto';
import { AddRoleDto } from './dto/addRole.dto';
import { BanUserDto } from './dto/banUser.dto';
import { UserService } from './user.service';

// FIXME: исправить конфликты с пользователями, UserResponse отдает без пароля, просмотреть все кейсы
@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получение всех пользователей
  @ApiOperation({
    summary: `Получить всех пользователей. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  @Get('users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // Получение пользователя по ID
  @ApiOperation({
    summary: `Получить пользователя по ID`,
  })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // Удаление пользователя по ID
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Delete('users/:id')
  deleteUserById(@Param('id') id: string, @CurrentUser() user: IJwtPayload) {
    return this.userService.deleteUserById(id, user);
  }

  // Изменение пользователя по ID
  @ApiOperation({ summary: 'Изменить пользователя по ID' })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Patch('users/:id')
  updateUserById(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.userService.updateUserById(id, userDto);
  }

  // Выдать роль пользователю
  @ApiOperation({
    summary: `Выдать роль пользователю. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiParam({
    name: 'role',
    example: {
      value: UserRoles.Editor,
      userId: 'dsjhdusacnsacihjaus',
    },
    required: true,
    type: Object,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Post('users/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  // Забанить пользователя
  @ApiOperation({
    summary: `Забанить пользователя. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Post('users/ban')
  ban(@Body() dto: BanUserDto, @CurrentUser('roles') roles: IRole[]) {
    return this.userService.ban(dto, roles);
  }

  // Разбанить пользователя
  @ApiOperation({
    summary: `Разбанить пользователя. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Post('users/unban/:id')
  unban(@Param('id') id: string, @CurrentUser('roles') roles: IRole[]) {
    return this.userService.unban(id, roles);
  }

  // Получить себя
  @ApiOperation({
    summary: 'Получить себя',
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('me')
  getMe(@CurrentUser() user: IJwtPayload) {
    return user;
  }
}
