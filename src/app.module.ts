import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { DriverModule } from './driver/driver.module';
import { RideModule } from './ride/ride.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './roles/roles.module';
import { TimestampInterceptor } from './common/interceptors/timestamp.interceptor';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Modulo de Autenticacion - Autorizacion
    AuthModule,
    RoleModule,
    // Modulos de entidades
    UserModule,
    DriverModule,
    RideModule,
  ],
  controllers: [AppController],
  providers: [
    {
      // Configuracion del provedor-interceptor de tiempo de manera global
      provide: APP_INTERCEPTOR,
      useClass: TimestampInterceptor,
    },
    // Solucion de declaracion de filtro de manera global que incluye la inyeccion de dependencias
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  // Configuracion del middleware de Logger de manera global
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
