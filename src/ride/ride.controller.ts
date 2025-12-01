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

@Controller('ride')
export class RideController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly rideService: RideService) { }

  // Solo usuarios
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createRideSchema)) createRideDto: CreateRideDto,
  ) {
    // Transformar aqui el 'distanceKm' y obtener el precio
    const pipe = new ParseKmPipe();
    const km = pipe.transform(createRideDto.distanceKm);

    const price = km * 10;

    // Mandamos el objeto con el disntanceKm validado y con el precio calculado
    return this.rideService.create(user, {
      ...createRideDto,
      distanceKm: km,
      price,
    });
  }

  // Todos menos admin
  @Get('me')
  listMyRides(@CurrentUser() user: User) {
    return this.rideService.listMyRides(user);
  }

  @Get(':id')
  getRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.getRide(user, rideId);
  }

  //Solo driver
  @Patch(':id/accept')
  acceptRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.acceptRide(user, rideId);
  }

  @Patch(':id/completed')
  completedRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.completedRide(user, rideId);
  }

  @Patch(':id/reject')
  rejectRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.rejectRide(user, rideId);
  }
}
