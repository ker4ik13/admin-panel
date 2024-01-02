import { Markup } from 'telegraf';
import type { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const mainButtons: Markup.Markup<ReplyKeyboardMarkup> = Markup.keyboard([
  [
    Markup.button.callback('⚙️ Настройки', 'settings'),
    Markup.button.callback('👤 Мой профиль', 'profile'),
  ],
]).resize(true);
