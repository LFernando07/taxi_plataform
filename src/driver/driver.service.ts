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
import { DatabaseException } from '../common/exceptions/database.exception';
import { User } from '../user/entities/user.entity';

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
      await this.usersService.update(userId, { role: Role.Driver }, user);
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
      .andWhere('driver.active = :active', { active: true })
      .getMany();

    if (!availablesDrivers)
      throw new NotFoundException('No hay choferes disponibles');

    return availablesDrivers;
  }

  async findOne(id: number, user: User) {
    // Si el usuario es admin puede ver cualquier perfil del conductor
    // Si el usuario es driver solo puede ver su informacion
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!driver)
      throw new NotFoundException(`El conductor con el ${id} no se encontro`);

    if (user.role === Role.Driver.toString() && driver?.user.id !== user.id) {
      throw new NotFoundException(
        `No tienes permisos para ver este perfil de conductor`,
      );
    }

    // De otro modo devolver la informacion la informacion
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...driverData } = driver.user;
    driver.user = driverData as User;

    return driver;
  }

  async findOneByUserId(id: number, user: User) {
    // Si el usuario es admin puede ver cualquier perfil del conductor
    // Si el usuario es driver solo puede ver su informacion
    const driver = await this.driverRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
    });

    if (!driver)
      throw new NotFoundException(
        `El conductor con el id ${id} no se encontro`,
      );

    if (user.role === Role.Driver.toString() && driver?.user.id !== user.id) {
      throw new NotFoundException(
        `No tienes permisos para ver este perfil de conductor`,
      );
    }

    // De otro modo devolver la informacion la informacion
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...driverData } = driver.user;
    driver.user = driverData as User;

    return driver;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto, user: User) {
    const driver = await this.findOne(id, user);
    if (!driver)
      throw new NotFoundException(`El conductor con el ${id} no se encontro`);

    const updateDriver = this.driverRepository.merge(driver, updateDriverDto);

    return this.driverRepository.save(updateDriver);
  }

  async remove(id: number) {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!driver) throw new NotFoundException('Driver no encontrado');

    // Si existe el conductor entonces realizamos la siguiente transaccion
    await this.driverRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          const user: User = driver.user;
          driver.active = false;
          await transactionalEntityManager.save(driver);

          user.role = Role.User.toString();
          await transactionalEntityManager.save(user);

          user.driverProfile = null;
          await transactionalEntityManager.save(user);
        } catch (error) {
          throw new DatabaseException(error);
        }
      },
    );

    return {
      message: 'Driver dado de baja correctamente',
    };
  }
}
