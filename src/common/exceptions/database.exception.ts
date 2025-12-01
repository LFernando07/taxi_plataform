import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(error: any) {
    super(
      {
        message: 'Error en la operación de base de datos',
        detail: error?.detail || error?.message || 'Unknown DB error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
