import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserResponse } from '@user/dto/responses';
import { UserService } from '@user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/types/IJwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: IJwtPayload) {
    const user: UserResponse = await this.userService
      .getUserById(payload._id)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user || user.isBlocked || user.blockReason) {
      throw new UnauthorizedException({
        message: ['Вы не авторизованы'],
      });
    }

    return payload;
  }
}
