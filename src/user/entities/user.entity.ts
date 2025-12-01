import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';
import { Ride } from '../../ride/entities/ride.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // user | driver | admin
  role: string;

  // Relaciones
  @OneToOne(() => Driver, (driver) => driver.user)
  driverProfile: Driver;

  @OneToMany(() => Ride, (ride) => ride.user)
  rides: Ride[];
}
