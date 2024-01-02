import { Markup } from 'telegraf';
import type { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const settingsButtons: Markup.Markup<InlineKeyboardMarkup> =
  Markup.inlineKeyboard(
    [
      Markup.button.callback('🪪 Узнать мой ID', 'checkMyId'),
      Markup.button.callback('✉️ Изменить почту', 'changeEmail'),
      Markup.button.callback('Назад', 'main'),
    ],
    {
      columns: 2,
    },
  );
