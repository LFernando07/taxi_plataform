import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { compareWithHashString, hashString } from '../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  signIn = async (loginUserDto: LoginUserDto) => {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    console.log(user, 'user-auth');
    //Nos traemos todo el usuario con password hasheada
    // Verificamos la coincidencia para autorizar token
    const isMatch = await compareWithHashString(
      loginUserDto.password,
      user.password,
    );
    console.log(isMatch, 'user match');
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const payload = { ...userWithoutPassword };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  };

  singUp = async (
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'driverProfile' | 'rides' | 'password'>> => {
    const hashedPassword = await hashString(createUserDto.password);
    const user = { ...createUserDto, password: hashedPassword };
    return this.usersService.create(user);
  };
}
