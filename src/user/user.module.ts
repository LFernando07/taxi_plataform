import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { RoleModule } from '../roles/roles.module';

@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [UserController],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
// eslint-disable-next-line prettier/prettier
export class UserModule { }
