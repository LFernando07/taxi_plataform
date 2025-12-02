/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string
}

// Interceptor que modifica la salida solo agregando el tiempo que tarda la request en ser procesada
@Injectable()
export class TimestampInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const now = Date.now();
    return next.handle().pipe(map((data) => ({ data, timestamp: `${Date.now() - now}ms` })));
  }
}
