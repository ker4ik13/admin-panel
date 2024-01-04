import { MailModule } from '@mail/mail.module';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';
import { TokenModule } from 'src/token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategies';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync(options()),
    MailModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
