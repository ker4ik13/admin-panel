import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '@user/dto/loginUser.dto';
import RegisterUserDro from '@user/dto/registerUser.dto';
import { UserDocument } from '@user/user.schema';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/token/token.schema';
import { TokenService } from 'src/token/token.service';
import { Tokens } from 'src/types/ITokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  // Вход
  async login(userDto: LoginUserDto, agent: string) {
    const user: UserDocument = await this.validateUser(userDto);

    if (!user) {
      throw new UnauthorizedException({
        message: ['Неверный логин или пароль'],
      });
    }

    return this.generateTokens(user, agent);
  }

  // Регистрация
  async register(userDto: RegisterUserDro, agent: string) {
    // Проверка, есть ли пользователь с таким email в Базе Данных
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new ConflictException({
        message: [
          `Пользователь с почтовым адресом ${userDto.email} уже существует.`,
        ],
      });
    }

    const user: UserDocument = await this.userService.registerUser({
      ...userDto,
      createdAt: new Date().toISOString(),
    });

    return await this.generateTokens(user, agent);
  }

  // Создание токенов
  private async generateTokens(user: UserDocument, agent: string) {
    const payload = {
      email: user.email,
      _id: user.id,
      roles: user.roles,
    };

    const accessToken = `Bearer ${this.jwtService.sign(payload)}`;
    const refreshToken = await this.getRefreshToken(user.id, agent);

    return {
      accessToken,
      refreshToken,
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
  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    return this.tokenService.getRefreshToken(userId, agent);
  }

  // Обновление токенов
  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.tokenService.findToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException({
        message: ['Вы не авторизованы'],
      });
    }

    await this.tokenService.deleteToken(refreshToken);

    // Если истекла дата токена
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user: UserDocument = await this.userService.getUserById(token.userId);

    return this.generateTokens(user, agent);
  }
}
