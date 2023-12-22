import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResponseModule } from './response/response.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RoleModule } from './roles/role.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        requireTLS: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        logger: true,
      },
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    ResponseModule,
    RoleModule,
    MailModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
