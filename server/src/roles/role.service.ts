import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private model: Model<Role>) {}

  // Создание новой роли
  async createRole(dto: CreateRoleDto) {
    return await this.model.create(dto);
  }

  async getRoleByValue(value: string) {
    return await this.model.findOne({ value: value });
  }
}
