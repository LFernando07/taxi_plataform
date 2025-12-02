import { loginSchemaDto } from '../schema/auth.schema';

export class LoginUserDto implements loginSchemaDto {
  email: string;
  password: string;
}
