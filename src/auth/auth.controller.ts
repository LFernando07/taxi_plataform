import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { loginSchema, registerSchemaDto } from './schema/auth.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // eslint-disable-next-line prettier/prettier
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User login successfully',
    // type: 'Access_Token',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UsePipes(new ZodValidationPipe(loginSchema))
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto);
  }

  @Public()
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 200,
    description: 'User register successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UsePipes(new ZodValidationPipe(registerSchemaDto))
  singUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.singUp(createUserDto);
  }
}
