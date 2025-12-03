import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createDriverSchema, updateDriverSchema } from './schema/driver.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
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
import { Driver } from './entities/driver.entity';

@ApiBearerAuth()
@ApiTags('driver')
@Controller('driver')
export class DriverController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly driverService: DriverService) { }

  @Roles(Role.Admin, Role.User)
  @Get()
  @Get()
  @ApiOperation({ summary: 'Get all available drivers' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [Driver],
  })
  async findAvailables(): Promise<Driver[]> {
    return await this.driverService.findAvailables();
  }

  @Roles(Role.User)
  @Post('register')
  @ApiOperation({ summary: 'Create driver profile' })
  @ApiBody({ type: CreateDriverDto })
  @ApiResponse({
    status: 201,
    description: 'Driver register successfully',
    type: Driver,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async register(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createDriverSchema))
    createDriverDto: CreateDriverDto,
  ) {
    return await this.driverService.register(user.id, createDriverDto);
  }

  @Roles(Role.Admin, Role.Driver)
  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Driver,
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async findOne(
    @CurrentUser() user: User,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Driver> {
    return await this.driverService.findOne(+id, user);
  }

  @Roles(Role.Admin, Role.Driver)
  @Patch(':id')
  @ApiOperation({ summary: 'Update driver by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDriverDto })
  @ApiResponse({
    status: 200,
    description: 'Driver updated',
    type: Driver,
  })
  async update(
    @CurrentUser() user: User,
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ZodValidationPipe(updateDriverSchema))
    updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    return await this.driverService.update(+id, updateDriverDto, user);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove driver profile by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Driver removed' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return await this.driverService.remove(+id);
  }
}
