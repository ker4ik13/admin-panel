import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '@user/dto/loginUser.dto';
import RegisterUserDro from '@user/dto/registerUser.dto';
import { UserResponse } from '@user/dto/responses';
import { UserDocument } from '@user/user.schema';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { Token } from 'src/token/token.schema';
import { TokenService } from 'src/token/token.service';
import { Tokens } from 'src/types/ITokens';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  // Вход
  async login(userDto: LoginUserDto, agent: string) {
    const user = await this.validateUser(userDto);

    if (!user) {
      throw new UnauthorizedException({
        message: ['Неверный логин или пароль'],
      });
    }

    return this.generateTokens(user, agent);
  }

  // Регистрация
  async register(userDto: RegisterUserDro): Promise<UserDocument> {
    // Проверка, есть ли пользователь с таким email в Базе Данных
    const candidate = await this.userService
      .getUserByEmail(userDto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (candidate) {
      throw new ConflictException({
        message: [
          `Пользователь с почтовым адресом ${userDto.email} уже существует.`,
        ],
      });
    }

    return await this.userService
      .registerUser({
        ...userDto,
        createdAt: new Date().toISOString(),
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
  }

  // Создание токенов
  private async generateTokens(
    user: UserDocument | UserResponse,
    agent: string,
  ) {
    const payload = {
      email: user.email,
      _id: user._id,
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.getRefreshToken(user._id, agent);

    return {
      access_token,
      refresh_token,
    };
  }

  // Проверка пользователя
  private async validateUser(userDto: RegisterUserDro | LoginUserDto) {
    try {
      // Проверка на правильный пароль
      const user = await this.userService.getUserByEmail(userDto.email);

      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );

      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: ['Некорректный email или пароль'],
      });
    }
  }

  // Создание refresh токена
  private async getRefreshToken(
    userId: string | Types.ObjectId,
    agent: string,
  ): Promise<Token> {
    return this.tokenService.getRefreshToken(userId, agent);
  }

  // Обновление токенов
  async refreshTokens(refresh_token: string, agent: string): Promise<Tokens> {
    const token = await this.tokenService.findToken(refresh_token);

    if (!token) {
      throw new UnauthorizedException({
        message: ['Вы не авторизованы'],
      });
    }

    await this.tokenService.deleteToken(refresh_token);

    // Если истекла дата токена
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException({
        message: ['Дата токена истекла'],
      });
    }

    const user = await this.userService.getUserById(token.userId);

    return this.generateTokens(user, agent);
  }

  // Удаление токена / выход пользователя
  async deleteRefreshToken(token: string) {
    return await this.tokenService.deleteToken(token);
  }
}
