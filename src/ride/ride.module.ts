import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { DatabaseModule } from '../database/database.module';
import { rideProviders } from './ride.providers';
import { DriverModule } from '../driver/driver.module';

@Module({
  imports: [DatabaseModule, DriverModule],
  providers: [RideService, ...rideProviders],
  controllers: [RideController],
})
// eslint-disable-next-line prettier/prettier
export class RideModule { }
