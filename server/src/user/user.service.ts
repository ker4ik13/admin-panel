import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/roles/role.service';
import { UserRoles, UserRolesLabels } from 'src/types/UserRoles';
import UserDto from 'src/user/dto/user.dto';
import { AddRoleDto } from './dto/addRole.dto';
import { BanUserDto } from './dto/banUser.dto';
import RegisterUserDro from './dto/registerUser.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    readonly roleService: RoleService,
    private readonly mailService: MailService,
  ) {}

  async registerUser(userDto: RegisterUserDro) {
    const role = await this.roleService.createRole({
      value: UserRoles.User,
      label: UserRolesLabels.User,
    });

    // Хеширование пароля и сохранение пользователя
    const hashPassword = await bcrypt.hash(userDto.password, 3);

    const newUser = {
      ...userDto,
      password: hashPassword,
      roles: [role.id],
    };

    const addedUser = await this.model.create(newUser);
    const returnUser: UserDocument = await addedUser.populate('roles');
    this.mailService.newUser(returnUser);
    // TODO: сделать отправку в телеграм
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

  async getUserById(id: string | Types.ObjectId) {
    return await this.model.findById(id).populate('roles').exec();
  }

  async deleteUserById(id: string) {
    return await this.model.findByIdAndDelete(id).populate('roles').exec();
  }

  async updateUserById(id: string, body: UserDto) {
    return await this.model
      .findByIdAndUpdate(id, body, { new: true })
      .populate('roles')
      .exec();
  }

  async getUserByEmail(email: string) {
    return await this.model.findOne({ email: email }).populate('roles').exec();
  }

  async getUserByTelegramId(id: number) {
    return await this.model
      .findOne({ telegramId: id })
      .populate('roles')
      .exec();
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
      const user = await this.model
        .findById(dto.userId)
        .populate('roles')
        .exec();

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
      const user = await this.model.findById(id).populate('roles').exec();

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
