import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '@user/dto/loginUser.dto';
import RegisterUserDro from '@user/dto/registerUser.dto';
import UserDto from '@user/dto/user.dto';
import { Response } from 'express';
import { Tokens } from 'src/types/ITokens';
import { AuthService } from './auth.service';
import { Cookie } from './decorators/cookies.decorator';
import { UserAgent } from './decorators/user-agent.decorator';

const REFRESH_TOKEN = 'refreshToken';

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 201,
    type: LoginUserDto,
  })
  @Post('login')
  async login(
    @Body() userDto: LoginUserDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const tokens = await this.authService.login(userDto, agent);

    if (!tokens) {
      throw new BadRequestException({
        message: ['Ошибка при входе'],
      });
    }
    this.setRefreshTokenInCookies(tokens, res);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, type: UserDto })
  @UsePipes(ValidationPipe)
  @Post('register')
  async register(@Body() userDto: RegisterUserDro, @UserAgent() agent: string) {
    const user = await this.authService.register(userDto, agent);

    if (!user) {
      throw new BadRequestException({
        message: ['Ошибка при регистрации'],
      });
    }

    return user;
  }

  @Post('refresh')
  async refresh(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException({
        message: ['Вы не авторизованы'],
      });
    }

    const tokens = await this.authService.refreshTokens(refreshToken, agent);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenInCookies(tokens, res);
  }

  private setRefreshTokenInCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException({
        message: ['Вы не авторизованы'],
      });
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
