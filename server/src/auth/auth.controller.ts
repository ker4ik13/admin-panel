import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from '@user/dto/loginUser.dto';
import RegisterUserDro from '@user/dto/registerUser.dto';
import { UserResponse } from '@user/dto/responses';
import UserDto from '@user/dto/user.dto';
import { Response } from 'express';
import { Tokens } from 'src/types/ITokens';
import { AuthService } from './auth.service';
import { Cookie, Public, UserAgent } from './decorators';

const REFRESH_TOKEN = 'refreshToken';

@Public()
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: HttpStatus.CREATED,
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
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @UsePipes(ValidationPipe)
  @Post('register')
  async register(@Body() userDto: RegisterUserDro) {
    const user = await this.authService.register(userDto);

    if (!user) {
      throw new BadRequestException({
        message: ['Ошибка при регистрации'],
      });
    }

    return new UserResponse(user);
  }

  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiCookieAuth('refreshToken')
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
      throw new UnauthorizedException({
        message: ['Ошибка обновления токенов'],
      });
    }

    this.setRefreshTokenInCookies(tokens, res);
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiCookieAuth('refreshToken')
  @Get('logout')
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }

    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });

    res.sendStatus(HttpStatus.OK);
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
