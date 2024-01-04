import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@user/user.schema';
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
    console.log('super strategy');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: IJwtPayload) {
    const user: User = await this.userService
      .getUserById(payload._id)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user || user.isBanned) {
      throw new UnauthorizedException({
        message: ['Вы не авторизованы'],
      });
    }

    return payload;
  }
}