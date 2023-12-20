import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { TokenModule } from 'src/token/token.module';
import { Role, RoleSchema } from 'src/roles/role.schema';
import { UserRole, UserRoleSchema } from 'src/roles/user-role.schema';
import { RoleModule } from 'src/roles/role.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    TokenModule,
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
