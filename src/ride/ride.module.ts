import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { DatabaseModule } from '../database/database.module';
import { rideProviders } from './ride.providers';
import { RoleModule } from '../roles/roles.module';

@Module({
  imports: [DatabaseModule, RoleModule],
  providers: [RideService, ...rideProviders],
  controllers: [RideController],
})
// eslint-disable-next-line prettier/prettier
export class RideModule { }
