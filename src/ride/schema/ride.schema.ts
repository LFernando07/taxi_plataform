import { z } from 'zod';

export const statusEnum = z.enum([
  'pending',
  'assigned',
  'rejected',
  'completed',
]);

export const createRideSchema = z.object({
  origin: z
    .string()
    .min(3, {
      error: 'El nombre del origen debe tener una logitud de 3 a 80 caracteres',
    })
    .max(80),
  destination: z
    .string()
    .min(3, {
      error:
        'El nombre del destino debe tener una logitud de 3 a 80 caracteres',
    })
    .max(80),
  distanceKm: z.string(),
  status: statusEnum.default('pending'),
});

export const updateRideSchema = createRideSchema.partial();

// Genera la inferencia entre el esquema y la entidad
export type CreateRideSchemaDto = z.infer<typeof createRideSchema>;
export type UpdateRideSchemaDto = z.infer<typeof updateRideSchema>;
