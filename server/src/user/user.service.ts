import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  // UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import UserDto from 'src/user/dto/user.dto';
import { TokenService } from 'src/token/token.service';
import { RoleService } from 'src/roles/role.service';
import CreateUserDto from './dto/createUser.dto';
import { UserRoles } from 'src/types/UserRoles';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    readonly tokenService: TokenService,
    readonly roleService: RoleService,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const role = await this.roleService.createRole({
      label: UserRoles.User,
      value: 'Пользователь',
    });

    const newUser = {
      ...userDto,
      roles: [role.id],
    };

    const addedUser = await this.model.create(newUser);
    return await addedUser.populate('roles');
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

  // Вход;
  async login(email: string, password: string) {
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new BadRequestException('Неверный пароль');
    }

    const userDto = new UserDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto._id, tokens.refreshToken);

    const returnUser = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userDto,
    };

    return returnUser;
  }

  // Выход
  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  // Обновление токенов
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    // Валидация токенов
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.model.findById(tokenFromDb.user);
    const userDto = new UserDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto._id, tokens.refreshToken);

    const returnUser = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userDto,
    };

    return returnUser;
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
}
