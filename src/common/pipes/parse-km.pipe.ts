import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseKmPipe implements PipeTransform {
  transform(value: any) {
    const km = Number(value);

    if (isNaN(km)) {
      throw new BadRequestException('El valor de km debe ser un número');
    }

    if (km <= 0) {
      throw new BadRequestException('Los kilómetros deben ser mayores a 0');
    }

    return km;
  }
}
