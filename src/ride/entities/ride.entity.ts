import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Driver } from '../../driver/entities/driver.entity';

export type RideStatus = 'pending' | 'assigned' | 'rejected' | 'completed';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rides)
  user: User;

  @ManyToOne(() => Driver, (driver) => driver.assignedRides, {
    nullable: true,
  })
  driver: Driver | null;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('float')
  distanceKm: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'assigned', 'rejected', 'completed'],
    default: 'pending',
  })
  status: RideStatus;

  @CreateDateColumn()
  createdAt: Date;
}
