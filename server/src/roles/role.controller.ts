import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './role.schema';
import { Roles } from 'src/auth/roles.auth.decorator';
import { UserRoles } from 'src/types/UserRoles';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@ApiTags('Роли пользователей')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Получить все роли' })
  @ApiResponse({ status: 200, type: [Role] })
  @Roles(UserRoles.Creator, UserRoles.Admin)
  @UseGuards(RolesGuard)
  @Get('roles')
  get() {
    return this.roleService.getRoles();
  }

  @ApiOperation({
    summary: `Добавление новой роли. Доступно с ролями: ${UserRoles.Creator}, ${UserRoles.Admin}`,
  })
  @ApiResponse({ status: 201, type: Role })
  @Roles(UserRoles.Creator, UserRoles.Admin)
  @UseGuards(RolesGuard)
  @Post('roles')
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({ summary: 'Получение роли' })
  @ApiParam({
    name: 'value',
    example: 'ADMIN',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, type: Role })
  @Get('roles/:value')
  getByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
