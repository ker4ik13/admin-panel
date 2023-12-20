import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResponseModule } from './response/response.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RoleModule } from './roles/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    ResponseModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
