import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { isRoleIncludes } from 'src/libs/helpers';
import { convertToSeconds } from 'src/libs/utils';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/roles/role.service';
import { TokenService } from 'src/token/token.service';
import { IJwtPayload } from 'src/types/IJwtPayload';
import { UserRoles, UserRolesLabels } from 'src/types/UserRoles';
import UserDto from 'src/user/dto/user.dto';
import { AddRoleDto } from './dto/addRole.dto';
import { BanUserDto } from './dto/banUser.dto';
import RegisterUserDro from './dto/registerUser.dto';
import { UserResponse } from './dto/responses';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(userDto: RegisterUserDro) {
    // Находим роль пользователя, если нет – создается новая

    const role = await this.roleService.getRoleByValueOrCreate({
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

    const addedUser = (await this.model.create(newUser)).populate('roles');
    const returnUser: UserDocument = await addedUser;
    this.mailService.newUser(returnUser);
    // TODO: сделать отправку в телеграм
    return addedUser;
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

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.model.find().populate('roles').exec();
    const allUsers: UserResponse[] = users.map(
      (user) => new UserResponse(user),
    );
    return allUsers;
  }

  async getUserById(id: string, isReset = false): Promise<UserResponse> {
    if (isReset) {
      await this.cacheManager.del(id);
    }

    const user = await this.cacheManager.get<UserResponse>(id);

    if (!user) {
      const foundUser = new UserResponse(
        await this.model.findById(id).populate('roles').exec(),
      );

      if (!foundUser) {
        return null;
      }

      await this.cacheManager.set(
        id,
        foundUser,
        convertToSeconds(this.configService.get('JWT_EXPIRES')),
      );
      return foundUser;
    }

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.model.findOne({ email }).populate('roles').exec();
  }

  async getUserByTelegramId(id: number): Promise<UserResponse> {
    return new UserResponse(
      await this.model.findOne({ telegramId: id }).populate('roles').exec(),
    );
  }

  async deleteUserById(id: string, user: IJwtPayload): Promise<UserResponse> {
    if (user._id !== id && !isRoleIncludes(UserRoles.Creator, user.roles)) {
      throw new ForbiddenException({
        message: ['У вас недостаточно прав'],
      });
    }

    // Удаление токенов пользователя
    await this.tokenService.deleteAllTokensByUserId(id);
    // Удаление пользователя из кеша
    await this.cacheManager.del(id);

    return new UserResponse(
      await this.model
        .findByIdAndDelete(id, { multi: true })
        .populate('roles')
        .exec(),
    );
  }

  async updateUserById(
    id: string,
    body: UserDto,
    user: IJwtPayload,
  ): Promise<UserResponse> {
    if (user._id !== id && !isRoleIncludes(UserRoles.Creator, user.roles)) {
      throw new ForbiddenException({
        message: ['У вас недостаточно прав'],
      });
    }

    return new UserResponse(
      await this.model
        .findByIdAndUpdate(id, body, { new: true })
        .populate('roles')
        .exec(),
    );
  }

  async updateUserByEmail(
    email: string,
    body: UserDto | UserResponse | User,
  ): Promise<UserResponse> {
    return new UserResponse(
      await this.model
        .findOneAndUpdate({ email }, body, { new: true })
        .populate('roles')
        .exec(),
    );
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.model.findById(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      user.roles.push(role.id);
      const newUser = await user.save();
      const userWithRoles = await newUser.populate('roles');
      return new UserResponse(userWithRoles);
    }

    throw new NotFoundException({
      message: ['Пользователь или роль не найдены'],
    });
  }

  // Забанить пользователя
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
      return new UserResponse(user);
    } catch (error) {
      throw new NotFoundException({
        message: ['Пользователь не был найден'],
      });
    }
  }

  // Разбанить пользователя
  async unban(id: string) {
    try {
      const user = await this.model.findById(id).populate('roles').exec();

      if (!user) {
        throw new NotFoundException({
          message: ['Пользователь не был найден'],
        });
      }

      const newUser = await this.model
        .findOneAndUpdate(
          { _id: id },
          { $unset: { isBanned: 1, banReason: 1 } },
          { new: true },
        )
        .populate('roles')
        .exec();

      return new UserResponse(newUser);
    } catch (error) {
      throw new NotFoundException({
        message: ['Пользователь не был найден'],
      });
    }
  }
}
