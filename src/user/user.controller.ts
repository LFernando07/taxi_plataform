import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { updateUserSchema, userSchema } from './schema/user.schema';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/roles.enum';

@Controller('user')
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userService: UserService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(userSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  // Error: Siempre ordenar las rutas de referencia sobre las que tienen parametros
  // NestJS evalúa las rutas en orden. Tener 'me' más abajo causara un error
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'driverProfile' | 'rides' | 'password'>> {
    return await this.userService.update(+id, updateUserDto, user);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.remove(+id);
  }
}
