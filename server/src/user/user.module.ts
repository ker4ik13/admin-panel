import { CacheModule } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { RoleModule } from 'src/roles/role.module';
import { Role, RoleSchema } from 'src/roles/role.schema';
import { UserRole, UserRoleSchema } from 'src/roles/user-role.schema';
import { TokenModule } from 'src/token/token.module';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    CacheModule.register(),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    RoleModule,
    MailModule,
    TokenModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
