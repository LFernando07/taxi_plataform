import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';
import { Ride } from '../../ride/entities/ride.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the User
   * @example 'Name Lastname'
   */
  @ApiProperty({ example: 'Name Lastname', description: 'Full name user' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password of the user',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Role of the user',
    enum: ['user', 'driver', 'admin'],
  })
  @Column() // user | driver | admin
  role: string;

  // Relaciones
  @ApiProperty({
    type: () => Driver,
    description: 'Driver profile associated with the user',
  })
  @OneToOne(() => Driver, (driver) => driver.user, { nullable: true })
  driverProfile?: Driver | null;

  @ApiProperty({
    type: () => Ride,
    isArray: true,
    description: 'Rides associated to the user',
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
  @OneToMany(() => Ride, (ride) => ride.user)
  rides: Ride[];
}
