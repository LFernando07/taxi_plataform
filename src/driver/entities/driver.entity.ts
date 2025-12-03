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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The informacion of the driver
   * @example 'User Driver'
   */
  @ApiProperty({
    type: () => User,
    description: 'User associated with the driver',
  })
  @OneToOne(() => User, (user) => user.driverProfile, { nullable: true })
  @JoinColumn()
  user: User;

  @ApiProperty({
    example: true,
    description: 'Availability status of the driver',
  })
  @Column({ default: true })
  available: boolean;

  @ApiProperty({
    example: true,
    description: 'Active status of the driver',
  })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({
    type: () => Ride,
    isArray: true,
    description: 'Rides assigned to the driver',
    example: [
      {
        id: 1,
        origin: 'Ciudad A',
        destination: 'Ciudad B',
        distanceKM: '1 km',
        price: 10.0,
        status: 'PENDING',
      },
    ],
  })
  @OneToMany(() => Ride, (ride) => ride.driver)
  assignedRides: Ride[];
}
