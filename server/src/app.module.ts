import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { MailModule } from './mail/mail.module';
import { RoleModule } from './roles/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
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
    RoleModule,
    MailModule,
    AuthModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
