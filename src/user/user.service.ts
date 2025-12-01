import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { repositories } from '../common/generalConstants';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject(repositories.providers.user)
    private userRepository: Repository<User>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  private async hashString(str: string): Promise<string> {
    const saltRounds = 10; // Define the cost factor for hashing

    return await bcrypt.hash(str, saltRounds);
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'driverProfile' | 'rides'>> {
    const hashedPassword = await this.hashString(createUserDto.password);
    const user = { ...createUserDto, password: hashedPassword };

    const newUser = this.userRepository.create(user);

    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: false,
        driverProfile: false,
        rides: false,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: false,
        driverProfile: false,
        rides: false,
      },
      where: { id },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatUser = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatUser);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return true;
  }
}
