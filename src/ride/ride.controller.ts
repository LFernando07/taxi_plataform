import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Ride } from './entities/ride.entity';

@ApiBearerAuth()
@ApiTags('ride')
@Controller('ride')
export class RideController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly rideService: RideService) { }

  // Solo usuarios
  @Roles(Role.User)
  @Post()
  @ApiOperation({ summary: 'Create ride' })
  @ApiBody({ type: CreateRideDto })
  @ApiResponse({
    status: 201,
    description: 'Ride created successfully',
    type: Ride,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createRideSchema)) createRideDto: CreateRideDto,
    @Body('distanceKm', ParseKmPipe) distanceKm: number,
  ): Promise<Ride> {
    return this.rideService.create(user, {
      ...createRideDto,
      distanceKm,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the list of rides for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  async listMyRides(@CurrentUser() user: User): Promise<Ride[]> {
    return await this.rideService.listMyRides(user);
  }

  // Solo User
  @Roles(Role.User)
  @Get(':id')
  @ApiOperation({ summary: 'Get ride by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ride found',
    type: Ride,
  })
  async getRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ): Promise<Ride> {
    return await this.rideService.getRide(user, rideId);
  }

  //Solo driver
  @Roles(Role.Driver)
  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accepted status ride by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ride status accepted',
    type: Ride,
  })
  acceptRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.acceptRide(user, rideId);
  }

  //Solo driver
  @Roles(Role.Driver)
  @Patch(':id/completed')
  @ApiOperation({ summary: 'Completed status ride by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ride status completed',
    type: Ride,
  })
  completedRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.completedRide(user, rideId);
  }

  //Solo driver
  @Roles(Role.Driver)
  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject status ride by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ride status reject',
    type: Ride,
  })
  rejectRide(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) rideId: number,
  ) {
    return this.rideService.rejectRide(user, rideId);
  }

  // Solo admin
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove ride by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Ride removed' })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return await this.rideService.remove(+id);
  }
}
