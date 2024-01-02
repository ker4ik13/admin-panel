import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
      inject: [ConfigService],
    }),
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
