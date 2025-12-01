import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { DatabaseModule } from '../database/database.module';
import { driveProviders } from './driver.providers';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../roles/roles.module';

@Module({
  imports: [DatabaseModule, UserModule, RoleModule],
  controllers: [DriverController],
  providers: [DriverService, ...driveProviders],
})
// eslint-disable-next-line prettier/prettier
export class DriverModule { }
