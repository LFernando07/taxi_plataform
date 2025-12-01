import { DataSource } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { repositories } from '../common/generalConstants';

export const driveProviders = [
  {
    provide: repositories.providers.driver,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Driver),
    inject: [repositories.inject],
  },
];
