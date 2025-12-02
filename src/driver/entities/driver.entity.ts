import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Ride } from '../../ride/entities/ride.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.driverProfile, { nullable: true })
  @JoinColumn()
  user: User;

  @Column({ default: true })
  available: boolean;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Ride, (ride) => ride.driver)
  assignedRides: Ride[];
}
