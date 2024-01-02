import { User } from 'src/user/user.schema';

export const userReply = (user: User) => {
  return `
	${user.isBanned ? `<b>Аккаунт забанен!</b>\nПричина: ${user.banReason}\n` : ''}
	<b>Имя:</b> ${user.name}
	<b>Фамилия:</b> ${user.lastName}
	<b>Email:</b> ${user.email}
	${user.isActivated ? '✅ Аккаунт активирован' : '❌ Аккаунт не активирован'}\n
	<b>Дата регистрации:</b> ${new Date(user.createdAt).toLocaleString('ru')}
	`;
};

// <b>Роли:</b> ${user.roles.map((role) => role.label)}
