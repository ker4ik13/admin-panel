import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { UserService } from 'src/user/user.service';
import { Telegraf } from 'telegraf';
import { mainButtons } from './buttons/main.buttons';
import { settingsButtons } from './buttons/settings.buttons';
import { Context } from './interfaces/context.interface';
import { userReply } from './user.reply';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userService: UserService,
  ) {}
  @Start()
  async start(ctx: Context) {
    await ctx.reply('Привет. Я бот помощник Kireev Dev', mainButtons);
  }

  @Action('checkMyId')
  async checkMyId(ctx: Context) {
    await ctx.replyWithHTML(
      `<b>Ваш ID: </b><code>${ctx.session.telegramId}</code>`,
      settingsButtons,
    );
  }

  @Action('main')
  async main(ctx: Context) {
    await ctx.reply('Меню', mainButtons);
  }

  @Hears('⚙️ Настройки')
  async settings(ctx: Context) {
    if (!ctx.session.telegramId) {
      ctx.session.telegramId = ctx.message.from.id;
    }

    await ctx.reply('Настройки', settingsButtons);
  }

  @Hears('👤 Мой профиль')
  async myProfile(ctx: Context) {
    if (!ctx.session.telegramId) {
      ctx.session.telegramId = ctx.message.from.id;
    }

    if (!ctx.session.email) {
      ctx.session.type = 'write-email';
      await ctx.reply(
        'Ваш профиль не привязан к админ панели. Введите ваш email, указанный при регистрации',
      );
    } else {
      ctx.session.type = 'default';
      const user = await this.userService.getUserByEmail(ctx.session.email);
      if (user.telegramId && user.telegramId === ctx.message.from.id) {
        await ctx.replyWithHTML(`Ваш профиль:${userReply(user)}`);
      } else {
        ctx.session.type = 'write-email';
        await ctx.reply(
          'Ваш профиль не привязан к админ панели. Введите ваш email, указанный при регистрации',
        );
      }
    }
  }

  @On('text')
  async getUserByEmail(@Message('text') email: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) {
      ctx.session.type = 'default';
    }

    if (ctx.session.type === 'write-email') {
      const user = await this.userService.getUserByEmail(email);

      if (user) {
        user.telegramId = ctx.session.telegramId;
        await user.save();
        ctx.session.email = email;
        await ctx.replyWithHTML(
          `Телеграм успешно подключен к вашему аккаунту.${userReply(user)}`,
        );
      } else {
        ctx.reply('Пользователь с таким email не найден 😕');
      }
    }
  }
}
