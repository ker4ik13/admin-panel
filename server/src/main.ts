import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3002;

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Сервер для админ панели')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Cервер запущен на порту ${PORT}.`);
    console.log(`http://localhost:${PORT}`);

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
