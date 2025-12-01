// Clase zod corregida debido a actializacion de ZodSchema deprecated in v4
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly schema: z.ZodTypeAny) { }

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return result.data;
  }
}
