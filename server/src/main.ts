import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3002;

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Cервер запущен на порту ${PORT}.`);
    if (+PORT === 3333) {
      console.log('Сервер запущен в режиме разработки.');
    }

    if (+PORT === 3001) {
      console.log('Сервер запущен в production режиме.');
    }

    if (+PORT !== 3001 && +PORT !== 3333) {
      console.log('Возможно путь к файлу .env указан неправильно.');
    }
  });
}
bootstrap();
