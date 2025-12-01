import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    // eslint-disable-next-line prettier/prettier
  ) { }
  compareWithHashString = async (
    plainStr: string,
    hashedStr: string,
  ): Promise<boolean> => {
    const isMatch = await bcrypt.compare(plainStr, hashedStr);
    return isMatch;
  };

  private async hashString(str: string): Promise<string> {
    const saltRounds = 10; // Define the cost factor for hashing

    return await bcrypt.hash(str, saltRounds);
  }

  signIn = async (loginUserDto: LoginUserDto) => {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    //Nos traemos todo el usuario con password hasheada
    // Verificamos la coincidencia para autorizar token
    const isMatch = await this.compareWithHashString(
      loginUserDto.password,
      user.password,
    );
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
  ): Promise<Omit<User, 'driverProfile' | 'rides'>> => {
    const hashedPassword = await this.hashString(createUserDto.password);
    const user = { ...createUserDto, password: hashedPassword };

    return this.usersService.create(user);
  };
}
