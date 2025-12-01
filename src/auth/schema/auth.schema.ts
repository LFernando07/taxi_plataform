import { z } from 'zod';
import { userSchema } from '../../user/schema/user.schema';

export const registerSchemaDto = userSchema;
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type loginSchemaDto = z.infer<typeof loginSchema>;
