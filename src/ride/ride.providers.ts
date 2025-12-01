import { DataSource } from 'typeorm';
import { repositories } from '../common/generalConstants';
import { Ride } from './entities/ride.entity';

export const rideProviders = [
  {
    provide: repositories.providers.ride,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Ride),
    inject: [repositories.inject],
  },
];
