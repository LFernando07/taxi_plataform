import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { repositories } from '../common/generalConstants';
import { Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../roles/roles.enum';
import { DatabaseException } from '../common/exceptions/database.exception';

@Injectable()
export class RideService {
  constructor(
    @Inject(repositories.providers.ride)
    private rideRepository: Repository<Ride>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  // Necesitammos usuario(current), driverId, y el createRide
  async create(user: User, createRideDto: CreateRideDto) {
    // Verificar que el usuario tenga rol de user...
    if (user.role !== Role.User.toString()) {
      throw new NotAcceptableException(
        'Solo los usuarios pueden crear viajes.',
      );
    }

    const newRide = this.rideRepository.create({
      user: user,
      ...createRideDto,
    });

    return this.rideRepository.save(newRide);
  }

  async listMyRides(user: User) {
    let rides: Array<Ride>;

    if (user.role === Role.Driver.toString()) {
      throw new NotAcceptableException(
        'Los conductores no puede listar viajes.',
      );
    }

    if (user.role === Role.Admin.toString()) {
      rides = await this.rideRepository.find();
    } else {
      rides = await this.rideRepository.find({ where: { user } });
    }

    if (!rides || rides.length === 0)
      throw new NotFoundException(`Rides by: ${user.name}  not found`);

    return rides;
  }

  async getRide(user: User, rideId: number) {
    if (user.role !== Role.User.toString()) {
      throw new NotAcceptableException(
        'Solo los usuarios pueden ver sus viajes.',
      );
    }

    const ride = await this.rideRepository.findOne({
      where: { id: rideId, user },
    });

    if (!ride) throw new NotFoundException(`Ride ${rideId} not found`);

    return ride;
  }

  async acceptRide(user: User, rideId: number) {
    // Status del viaje en "pendiente" para poder pasarlo a aceptado
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['driver', 'user'],
    });

    if (!ride) {
      throw new NotFoundException(`Ride #${rideId} not found`);
    }
    // Verificar si el viaje esta pendiente
    const isPending = ride.status === 'pending';
    // Verificar que el driver este vacio
    const isAssignable = ride?.driver === null;
    // el usuario sea de tipo "drive" para aceptar
    const isDriver = user.role === Role.Driver.toString();
    // El conductor este libre para aceptar el viaje
    const isAvailableDriver = user.driverProfile?.available;
    if (!isDriver) {
      throw new NotAcceptableException(
        'Solo un conductor puede aceptar viajes',
      );
    }

    if (!isPending) {
      throw new NotAcceptableException('El viaje ya no está disponible');
    }

    if (!isAssignable) {
      throw new NotAcceptableException(
        'El viaje ya fue asignado a un conductor',
      );
    }

    if (!isAvailableDriver) {
      throw new NotAcceptableException(
        'No puedes aceptar viajes porque estás ocupado',
      );
    }

    // cambiar el status del viaje a "asignado"
    // cambiar la disponibilidad del chofer
    // Iniciamos transaccion
    return await this.rideRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          ride.status = 'assigned';
          if (user.driverProfile) ride.driver = user.driverProfile;

          if (user.driverProfile) {
            user.driverProfile.available = false;
          }
          await transactionalEntityManager.save(ride);
          await transactionalEntityManager.save(user.driverProfile);

          return {
            message: 'Viaje aceptado',
            rideId: ride.id,
            driver: user.name,
          };
        } catch (error) {
          throw new DatabaseException(error);
        }
      },
    );
  }

  async completedRide(user: User, rideId: number) {
    // Buscar el viaje con las relaciones necesarias
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['driver', 'user'],
    });

    if (!ride) {
      throw new NotFoundException(`Ride #${rideId} not found`);
    }

    // Validaciones de negocio
    const isDriver = user.role === Role.Driver.toString();
    const isAssigned = ride.status === 'assigned';
    const isSameDriver = ride.driver?.id === user.driverProfile?.id;
    const isBusy = user.driverProfile?.available === false;

    if (!isDriver) {
      throw new NotAcceptableException(
        'Solo un conductor puede completar viajes',
      );
    }

    if (!isAssigned) {
      throw new NotAcceptableException(
        'El viaje no se puede completar porque no está asignado',
      );
    }

    if (!isSameDriver) {
      throw new NotAcceptableException(
        'No puedes completar un viaje que no te fue asignado',
      );
    }

    if (!isBusy) {
      throw new NotAcceptableException(
        'No puedes completar viajes porque actualmente estás disponible',
      );
    }

    // Transacción
    return await this.rideRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          ride.status = 'completed';
          if (user.driverProfile) user.driverProfile.available = true;

          await transactionalEntityManager.save(ride);
          await transactionalEntityManager.save(user.driverProfile);

          return {
            message: 'Viaje completado correctamente',
            rideId: ride.id,
            driver: user.name,
          };
        } catch (error) {
          throw new DatabaseException(error);
        }
      },
    );
  }

  async rejectRide(user: User, rideId: number) {
    // Buscar el viaje
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver'],
    });

    if (!ride) {
      throw new NotFoundException(`Ride #${rideId} not found`);
    }

    // Validaciones principales
    const isDriver = user.role === Role.Driver.toString();
    const isPending = ride.status === 'pending';
    const rideHasNoDriver = ride.driver === null;
    const isAvailableDriver = user.driverProfile?.available === true;

    if (!isDriver) {
      throw new NotAcceptableException(
        'Solo un conductor puede rechazar viajes',
      );
    }

    if (!isPending) {
      throw new NotAcceptableException(
        'Solo puedes rechazar viajes que están en estado pendiente',
      );
    }

    if (!rideHasNoDriver) {
      throw new NotAcceptableException(
        'Este viaje ya fue asignado a un conductor',
      );
    }

    if (!isAvailableDriver) {
      throw new NotAcceptableException(
        'No puedes rechazar viajes porque actualmente estás ocupado',
      );
    }

    // Si todas las validaciones pasan → Registrar rechazo
    // (No cambia estado, pero puedes incrementar métrica,
    //  bloquearlo para este chofer, etc.)
    // En este ejercicio solo devolvemos un mensaje.
    return {
      message: 'Has rechazado este viaje. Otros conductores podrán aceptarlo.',
      rideId: ride.id,
    };
  }
}
