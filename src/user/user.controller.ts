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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UsePipes(new ZodValidationPipe(userSchema))
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'driverProfile' | 'rides' | 'password'>> {
    return await this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [User],
  })
  async findAll(): Promise<
    Omit<User, 'driverProfile' | 'rides' | 'password'>[]
  > {
    return await this.userService.findAll();
  }

  // Error: Siempre ordenar las rutas de referencia sobre las que tienen parametros
  // NestJS evalúa las rutas en orden. Tener 'me' más abajo causara un error
  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Roles(Role.Admin)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Omit<User, 'driverProfile' | 'rides' | 'password'>> {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @CurrentUser() user: User,
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'driverProfile' | 'rides' | 'password'>> {
    return await this.userService.update(+id, updateUserDto, user);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User removed' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.remove(+id);
  }
}
