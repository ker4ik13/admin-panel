import { CurrentUser, Roles } from '@auth/decorators';
import { RolesGuard } from '@auth/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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
  @ApiResponse({ status: 200, type: [UserDto] })
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
  @ApiResponse({ status: 200, type: UserDto })
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
  @ApiResponse({ status: 200, type: UserDto })
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
  @ApiResponse({ status: 204, type: UserDto })
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
  @ApiResponse({ status: 200, type: UserDto })
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
  @ApiResponse({ status: 200 })
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
  @Roles(UserRoles.Creator, UserRoles.Admin)
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200 })
  @Post('users/unban/:id')
  unban(@Param('id') id: string, @CurrentUser('roles') roles: IRole[]) {
    return this.userService.unban(id, roles);
  }
}
