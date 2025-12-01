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

@Controller('driver')
export class DriverController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly driverService: DriverService) { }

  @Get()
  findAvailables() {
    return this.driverService.findAvailables();
  }

  @Post('register')
  register(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createDriverSchema))
    createDriverDto: CreateDriverDto,
  ) {
    return this.driverService.register(user.id, createDriverDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.driverService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ZodValidationPipe(updateDriverSchema))
    updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.driverService.remove(+id);
  }
}
