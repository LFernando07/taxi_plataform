import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { repositories } from '../common/generalConstants';
import { Repository } from 'typeorm';
import { hashString } from '../common/utils/hash.util';
import { Role } from '../roles/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(repositories.providers.user)
    private userRepository: Repository<User>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'driverProfile' | 'rides'>> {
    const user = { ...createUserDto };

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
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        driverProfile: false,
        rides: false,
      },
      where: { email },
    });
    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: User) {
    const existsUser = await this.findOne(id);

    if (user.role !== Role.Admin.toString() && user.id !== existsUser.id) {
      throw new NotFoundException(
        `No tienes permisos para actualizar este usuario`,
      );
    }

    let updatUser: User;
    if (updateUserDto.password !== undefined) {
      const newPassword = await hashString(updateUserDto.password);
      console.log(newPassword);
      updatUser = this.userRepository.merge(existsUser, {
        ...updateUserDto,
        password: newPassword,
      });
    } else {
      updatUser = this.userRepository.merge(existsUser, updateUserDto);
    }
    await this.userRepository.save(updatUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updateUserWithoutPassword } = updatUser;
    return updateUserWithoutPassword;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return true;
  }
}
