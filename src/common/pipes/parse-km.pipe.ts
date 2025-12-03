import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseKmPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        'La distancia debe ser un string como "12 km"',
      );
    }

    // Extraer número de la cadena
    const match = value.match(/[\d.]+/);

    if (!match) {
      throw new BadRequestException(
        'No se pudo obtener un número válido para los km',
      );
    }

    const km = parseFloat(match[0]);

    if (isNaN(km) || km <= 0) {
      throw new BadRequestException('La distancia debe ser mayor a 0');
    }
    return km;
  }
}
