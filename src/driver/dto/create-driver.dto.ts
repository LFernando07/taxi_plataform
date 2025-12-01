import { CreateDriverSchemaDto } from '../schema/driver.schema';

export class CreateDriverDto implements CreateDriverSchemaDto {
  available?: boolean;
}
