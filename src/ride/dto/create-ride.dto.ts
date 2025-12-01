import { CreateRideSchemaDto } from '../schema/ride.schema';

export type StatusType = 'pending' | 'assigned' | 'rejected' | 'completed';

export class CreateRideDto implements CreateRideSchemaDto {
  origin: string;
  destination: string;
  distanceKm: number;
  price: number;
  status: StatusType;
}
