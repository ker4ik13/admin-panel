import { CurrentUser } from '@auth/decorators';
import { RolesGuard } from '@auth/guards';
import { Roles } from '@common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IJwtPayload } from 'src/types/IJwtPayload';
import { UserRoles } from 'src/types/UserRoles';
import UserDto from 'src/user/dto/user.dto';
import { AddRoleDto } from './dto/addRole.dto';
import { BanUserDto } from './dto/banUser.dto';
import { UserService } from './user.service';

// TODO: разбить по ролям
@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получение всех пользователей
  @ApiOperation({
    summary: `Получить всех пользователей. Доступен с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  @UseGuards(RolesGuard)
  @Roles(UserRoles.Creator, UserRoles.Admin)
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
  @ApiOperation({ summary: `Удалить пользователя по ID.` })
  @ApiParam({
    name: 'id',
    example: 'k34jjnsdfusa8i#3ddr3',
    required: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @UseGuards(RolesGuard)
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
  updateUserById(
    @Param('id') id: string,
    @Body() userDto: UserDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    return this.userService.updateUserById(id, userDto, user);
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
  ban(@Body() dto: BanUserDto) {
    return this.userService.ban(dto);
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
  @UseGuards(RolesGuard)
  @Roles(UserRoles.Creator, UserRoles.Admin)
  @Post('users/unban/:id')
  unban(@Param('id') id: string) {
    return this.userService.unban(id);
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
