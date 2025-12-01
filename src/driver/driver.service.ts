import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { repositories } from '../common/generalConstants';
import { Driver } from './entities/driver.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Role } from '../roles/roles.enum';

@Injectable()
export class DriverService {
  constructor(
    private usersService: UserService,
    @Inject(repositories.providers.driver)
    private driverRepository: Repository<Driver>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async register(userId: number, createDriverDto: CreateDriverDto) {
    //Validar que el usuario exista
    const user = await this.usersService.findOne(userId);
    if (!user)
      throw new NotFoundException(`El usuario con ${userId} no existe`);

    // Si el usuario existe verificar el rol
    if (user.role === Role.Admin.toString())
      throw new NotAcceptableException('Operacion no valida');

    // Si ya tiene perfil de driver → NO crear otro
    if (user.driverProfile) {
      throw new NotAcceptableException(
        'El usuario ya está registrado como conductor',
      );
    }

    // Si el usuario es de tipo 'user'
    if (user.role === Role.User.toString()) {
      await this.usersService.update(userId, { role: Role.Driver });
    }

    // De otro modo (role: 'driver)
    // Crear el perfil de conductor usando la relación
    const newDriver = this.driverRepository.create({
      user: user,
      available: createDriverDto.available,
    });

    return this.driverRepository.save(newDriver);
  }

  async findAvailables() {
    const availablesDrivers = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.user', 'user')
      .select(['driver.id', 'driver.available', 'user.name', 'user.email'])
      .where('driver.available = :available', { available: true })
      .getMany();

    if (!availablesDrivers) return 'No hay choferes disponibles';

    return availablesDrivers;
  }

  async findOne(id: number) {
    const driver = await this.driverRepository.findOne({ where: { id } });
    if (!driver)
      throw new NotFoundException(`El conductor con el ${id} no se encontro`);

    return driver;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    const driver = await this.findOne(id);
    if (!driver)
      throw new NotFoundException(`El conductor con el ${id} no se encontro`);

    const updateDriver = this.driverRepository.merge(driver, updateDriverDto);

    return this.driverRepository.save(updateDriver);
  }

  async remove(id: number) {
    const result = await this.driverRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return true;
  }
}
