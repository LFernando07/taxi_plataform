import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { ApiProperty } from '@nestjs/swagger';

export type RideStatus = 'pending' | 'assigned' | 'rejected' | 'completed';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The informacion of the ride
   * @example 'User Driver'
   */
  @ApiProperty({
    type: () => User,
    description: 'User associated with the ride',
  })
  @ManyToOne(() => User, (user) => user.rides)
  user: User;

  @ApiProperty({
    type: () => Driver,
    description: 'Driver assigned to the ride',
  })
  @ManyToOne(() => Driver, (driver) => driver.assignedRides, {
    nullable: true,
  })
  driver: Driver | null;

  @ApiProperty({
    example: 'Point A',
    description: 'Origin of the ride',
  })
  @Column()
  origin: string;

  @ApiProperty({
    example: 'Point B',
    description: 'Destination of the ride',
  })
  @Column()
  destination: string;

  @ApiProperty({
    example: '10 km',
    description: 'Distance of the ride',
  })
  @Column('float')
  distanceKm: number;

  @ApiProperty({
    example: 100,
    description: 'Price of the ride',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the ride',
    enum: ['pending', 'assigned', 'rejected', 'completed'],
  })
  @Column({
    type: 'enum',
    enum: ['pending', 'assigned', 'rejected', 'completed'],
    default: 'pending',
  })
  status: RideStatus;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Creation date of the ride',
  })
  @CreateDateColumn()
  createdAt: Date;
}
