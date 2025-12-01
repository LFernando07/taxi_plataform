import { CreateUserSchemaDto } from '../schema/user.schema';
export type RoleType = 'user' | 'driver' | 'admin';
export class CreateUserDto implements CreateUserSchemaDto {
  name: string;

  email: string;

  password: string;

  role: RoleType;
}
