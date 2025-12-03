import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { DatabaseModule } from '../database/database.module';
import { driveProviders } from './driver.providers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [DriverController],
  providers: [DriverService, ...driveProviders],
  exports: [DriverService],
})
// eslint-disable-next-line prettier/prettier
export class DriverModule { }
