import { DataSource } from 'typeorm';
import { repositories } from '../common/generalConstants';
import { User } from './entities/user.entity';

export const userProviders = [
  {
    provide: repositories.providers.user,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [repositories.inject],
  },
];
