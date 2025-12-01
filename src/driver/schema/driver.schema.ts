import { z } from 'zod';

export const createDriverSchema = z.object({
  available: z.boolean().optional(),
});

export const updateDriverSchema = createDriverSchema.partial();

export type CreateDriverSchemaDto = z.infer<typeof createDriverSchema>;
export type UpdateDriverSchemaDto = z.infer<typeof updateDriverSchema>;
