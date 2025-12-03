import { ApiProperty } from '@nestjs/swagger';
import { CreateUserSchemaDto } from '../schema/user.schema';
export type RoleType = 'user' | 'driver' | 'admin';
export class CreateUserDto implements CreateUserSchemaDto {
  /**
   * The name of the User
   * @example 'Name Lastname'
   */
  @ApiProperty({ example: 'Name Lastname', description: 'Full name user' })
  name: string;

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

  @ApiProperty({
    example: 'user',
    description: 'Role of the user',
    enum: ['user', 'driver', 'admin'],
  })
  role: RoleType;
}
