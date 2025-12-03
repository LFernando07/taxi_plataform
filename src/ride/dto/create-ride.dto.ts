import { ApiProperty } from '@nestjs/swagger';

export type StatusType = 'pending' | 'assigned' | 'rejected' | 'completed';

export class CreateRideDto {
  @ApiProperty({
    example: 'Point A',
    description: 'Origin of the ride',
  })
  origin: string;
  @ApiProperty({
    example: 'Point B',
    description: 'Destination of the ride',
  })
  destination: string;
  @ApiProperty({
    example: '10 km',
    description: 'Distance of the ride',
  })
  distanceKm: number;
  @ApiProperty({
    example: 'pending',
    description: 'Status of the ride',
    enum: ['pending', 'assigned', 'rejected', 'completed'],
  })
  status: StatusType;
}
