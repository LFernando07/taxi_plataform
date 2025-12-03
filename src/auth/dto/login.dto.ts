import { ApiProperty } from '@nestjs/swagger';
import { loginSchemaDto } from '../schema/auth.schema';

export class LoginUserDto implements loginSchemaDto {
  /**
   * The email of the User
   * @example 'user@example.com'
   */
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password of the user',
  })
  password: string;
}
