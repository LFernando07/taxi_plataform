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

@Controller('driver')
export class DriverController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly driverService: DriverService) { }

  @Roles(Role.Admin, Role.User)
  @Get()
  async findAvailables() {
    return await this.driverService.findAvailables();
  }

  @Roles(Role.User)
  @Post('register')
  async register(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createDriverSchema))
    createDriverDto: CreateDriverDto,
  ) {
    return await this.driverService.register(user.id, createDriverDto);
  }

  @Roles(Role.Admin, Role.Driver)
  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return await this.driverService.findOne(+id, user);
  }

  @Roles(Role.Admin, Role.Driver)
  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ZodValidationPipe(updateDriverSchema))
    updateDriverDto: UpdateDriverDto,
  ) {
    return await this.driverService.update(+id, updateDriverDto, user);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return await this.driverService.remove(+id);
  }
}
