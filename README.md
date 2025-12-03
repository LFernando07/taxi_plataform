🚖 Taxi Platform – Backend API

Sistema backend desarrollado con NestJS para la gestión de una plataforma de taxis.
Incluye autenticación con JWT, roles de usuario (user, driver, admin), gestión de viajes, vehículos y usuarios.

<p align="center"> <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p>
📌 Descripción del Proyecto

Este repositorio contiene el backend de una plataforma de taxis, construido con NestJS + TypeScript, diseñado para ser escalable, modular y seguro.

Este backend permite:

✔ Registro e inicio de sesión con JWT
✔ Roles de usuario (user, driver, admin)
✔ Gestión de usuarios y conductores
✔ Gestión de vehículos
✔ Creación y consulta de viajes
✔ Validación de datos con DTOs
✔ Documentación interactiva con Swagger
✔ Arquitectura modular siguiendo buenas prácticas de NestJS

🛠️ Tecnologías Utilizadas

NestJS (Framework principal)

TypeScript

JWT Authentication

Prisma u ORM equivalente (si aplica)

Swagger para documentación de API

PNPM para gestión de paquetes

📁 Estructura del Proyecto

La arquitectura está basada en módulos independientes:

src/
├── auth/ → Autenticación y JWT
├── user/ → Usuarios y roles
├── driver/ → Conductores
├── ride/ → Vehículos
├── roles/ → Roles de usuarios
├── common/ → Decoradores, interceptores, pipes
├── app.module.ts
└── main.ts → Punto de entrada

Cada módulo incluye controllers, services, DTOs y esquemas definidos con claridad.

🚀 Instalación
pnpm install

▶️ Ejecutar el Proyecto

# Modo desarrollo

pnpm run start:dev

# Modo normal

pnpm run start

# Producción

pnpm run start:prod

🧪 Testing

# Unit tests

pnpm run test

# End-to-end tests

pnpm run test:e2e

# Cobertura

pnpm run test:cov

📄 Documentación de API (Swagger)

Cuando el servidor está en ejecución, accede a:

http://localhost:3000/api

Allí podrás visualizar:

Endpoints de Auth

Roles

Usuarios

Conductores

Vehículos

Viajes

🔐 Roles en el Sistema
Rol Descripción
user Usuario normal que solicita viajes
driver Conductor registrado que puede aceptar viajes
admin Administrador con control total del sistema
🌐 Deployment

Para despliegue en producción consulta la documentación oficial de NestJS:

https://docs.nestjs.com/deployment

📚 Recursos Útiles

Documentación oficial de NestJS: https://docs.nestjs.com/

Repositorio del proyecto: https://github.com/LFernando07/taxi_plataform

📄 Licencia

Este proyecto está licenciado bajo MIT.
