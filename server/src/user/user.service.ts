import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import UserDto from 'src/user/dto/user.dto';
import { RoleService } from 'src/roles/role.service';
import CreateUserDto from './dto/createUser.dto';
import { UserRoles, UserRolesLabels } from 'src/types/UserRoles';
import { AddRoleDto } from './dto/addRole.dto';
import { BanUserDto } from './dto/banUser.dto';
import { MailService } from 'src/mail/mail.service';
import { IUser } from 'src/types/IUser';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    readonly roleService: RoleService,
    private readonly mailService: MailService,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const role = await this.roleService.createRole({
      value: UserRoles.User,
      label: UserRolesLabels.User,
    });

    const newUser = {
      ...userDto,
      roles: [role.id],
    };

    const addedUser = await this.model.create(newUser);
    const returnUser: IUser = await addedUser.populate('roles');
    this.mailService.newUser(returnUser);
    return returnUser;
  }

  // Активация аккаунта
  async activate(activationLink: string) {
    const user = await this.model.findOne({ activationLink });

    if (!user) {
      throw new BadRequestException('Некорректная ссылка активации');
    }

    user.isActivated = true;
    const activatedUser = await user.save();
    return activatedUser;
  }

  async getAllUsers() {
    return await this.model.find().populate('roles').exec();
  }

  async getUser(id: string) {
    return await this.model.findById(id).populate('roles').exec();
  }

  async deleteUser(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async updateUser(id: string, body: UserDto) {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }

  async getUserByEmail(email: string) {
    return await this.model.findOne({ email: email }).populate('roles').exec();
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.model.findById(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      user.roles.push(role.id);
      await user.save();
      return dto;
    }

    throw new NotFoundException({
      message: ['Пользователь или роль не найдены'],
    });
  }

  // Бан пользователя
  async ban(dto: BanUserDto) {
    try {
      const user = await this.model.findById(dto.userId);

      if (!user) {
        throw new NotFoundException({
          message: ['Пользователь не был найден'],
        });
      }

      user.isBanned = true;
      user.banReason = dto.banReason;
      await user.save();
      return user;
    } catch (error) {
      throw new NotFoundException({
        message: ['Пользователь не был найден'],
      });
    }
  }

  // Разюан пользователя
  async unban(id: string) {
    try {
      const user = await this.model.findById(id);

      if (!user) {
        throw new NotFoundException({
          message: ['Пользователь не был найден'],
        });
      }

      user.isBanned = false;
      user.banReason = '';
      await user.save();
      return user;
    } catch (error) {
      throw new NotFoundException({
        message: ['Пользователь не был найден'],
      });
    }
  }
}
