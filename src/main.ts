import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Construcción de opciones de documentación con swagger
  const options = new DocumentBuilder()
    .setTitle('Taxi Service Api')
    .setDescription('Mini platform for private taxi bookings')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  //Construccioón del modulo de documentación & el acceso a la api
  const document = SwaggerModule.createDocument(app, options);
  // Agrs: ruta de acceso a la api // app o instancia de NestApp // documento de la api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
