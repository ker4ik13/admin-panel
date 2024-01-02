import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    AuthModule,
    UserModule,
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TOKEN'),
        middlewares: [sessions.middleware()],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BotController],
  providers: [BotService, BotUpdate],
  exports: [BotService],
})
export class BotModule {}
