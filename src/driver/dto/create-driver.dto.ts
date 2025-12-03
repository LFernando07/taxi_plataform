import { ApiProperty } from '@nestjs/swagger';
import { CreateDriverSchemaDto } from '../schema/driver.schema';

export class CreateDriverDto implements CreateDriverSchemaDto {
  @ApiProperty({
    example: true,
    description: 'Availability status of the driver',
  })
  available?: boolean;
}
