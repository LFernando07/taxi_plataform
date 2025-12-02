import { z } from 'zod';

export const roleEnum = z.enum(['user', 'driver', 'admin']);

export const userSchema = z.object({
  name: z
    .string()
    .min(3, {
      error: 'El nombre debe tener una longitud de 3 a 60 caracteres',
    })
    .max(60),
  email: z.email(),
  password: z.string(),
  role: roleEnum,
});

export const updateUserSchema = userSchema.partial();

// Genera la inferencia entre el esquema y la entidad
export type CreateUserSchemaDto = z.infer<typeof userSchema>;
export type UpdateUserSchemaDto = z.infer<typeof updateUserSchema>;
