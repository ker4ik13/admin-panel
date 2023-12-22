import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { UserRole, UserRoleSchema } from './user-role.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secret-key',
      signOptions: {
        expiresIn: process.env.NODE_ENV === 'development' ? '24h' : '30m',
      },
    }),
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
