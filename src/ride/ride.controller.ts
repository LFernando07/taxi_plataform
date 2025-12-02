import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createRideSchema } from './schema/ride.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ParseKmPipe } from '../common/pipes/parse-km.pipe';
import { Role } from '../roles/roles.enum';
import { Roles } from '../roles/decorators/roles.decorator';

@Controller('ride')
export class RideController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly rideService: RideService) { }

  // Solo usuarios
  @Roles(Role.User)
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createRideSchema))
    createRideDto: CreateRideDto,
    @Body('distance', ParseKmPipe) distance: number,
  ) {
    return this.rideService.create(user, {
      ...createRideDto,
      distanceKm: distance,
    });
  }

  // Todos menos driver
  @Roles(Role.Admin, Role.User)
  @Get('me')
  listMyRides(@CurrentUser() user: User) {
    return this.rideService.listMyRides(user);
  }

  // Solo User
  @Roles(Role.User)
  @Get(':id')
  getRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.getRide(user, rideId);
  }

  //Solo driver
  @Roles(Role.Driver)
  @Patch(':id/accept')
  acceptRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.acceptRide(user, rideId);
  }

  //Solo driver
  @Roles(Role.Driver)
  @Patch(':id/completed')
  completedRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.completedRide(user, rideId);
  }

  //Solo driver
  @Roles(Role.Driver)
  @Patch(':id/reject')
  rejectRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.rejectRide(user, rideId);
  }
}
