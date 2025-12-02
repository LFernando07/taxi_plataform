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

  @Column() // user | driver | admin
  role: string;

  // Relaciones
  @OneToOne(() => Driver, (driver) => driver.user, { nullable: true })
  driverProfile?: Driver | null;

  @OneToMany(() => Ride, (ride) => ride.user)
  rides: Ride[];
}
