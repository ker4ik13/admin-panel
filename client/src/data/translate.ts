export interface ITranslate {
  [value: string]: {
    [text: string]: {
      ru: string;
      en: string;
    }
  },
}

export const language = 'ru';

export const translate: ITranslate = {
  sidebar: {
    dashboard: {
      ru: 'Дашборд',
      en: 'Dashboard'
    },
    responses: {
      ru: 'Отклики',
      en: 'Responses'
    },
    mailings: {
      ru: 'Рассылки',
      en: 'Mailings'
    },
    orders: {
      ru: 'Заказы',
      en: 'Orders'
    },
    users: {
      ru: 'Пользователи',
      en: 'Users'
    },
    articles: {
      ru: 'Статьи',
      en: 'Articles'
    },
    help: {
      ru: 'Помощь',
      en: 'Help',
    },
    documentation: {
      ru: 'Документация',
      en: 'Documentation',
    },
    wallet: {
      ru: 'Кошелек',
      en: 'Wallet',
    },
  },
  header: {
    hello: {
      ru: 'Привет',
      en: 'Hi',
    },
    letters: {
      ru: 'Письма',
      en: 'Letters',
    },
    notifications: {
      ru: 'Уведомления',
      en: 'Notifications',
    },
    myProfile: {
      ru: 'Мой профиль',
      en: 'My profile',
    },
    settings: {
      ru: 'Настройки',
      en: 'Settings',
    },
    logout: {
      ru: 'Выйти',
      en: 'Log out',
    },
  },
  settings: {
    title: {
      ru: 'Настройки',
      en: 'Settings',
    },
    darkTheme: {
      ru: 'Темная тема',
      en: 'Dark theme',
    },
  },
  notification: {
    darkThemeOn: {
      ru: 'Включена темная тема',
      en: 'Dark theme enabled',
    },
    lightThemeOn: {
      ru: 'Включена светлая тема',
      en: 'Light theme enabled',
    }
  },
  main: {
    title: {
      ru: 'Дашборд',
      en: 'Dashboard',
    }
  }
}