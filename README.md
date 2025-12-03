🚖 Taxi Platform – Backend API

Sistema backend desarrollado con NestJS para la gestión de una plataforma de taxis.
Incluye autenticación con JWT, manejo de roles (user, driver, admin), gestión de viajes, vehículos y usuarios, y documentación con Swagger.

<p align="center"> <a href="http://nestjs.com/" target="blank"> <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /> </a> </p>
📌 Descripción del Proyecto

Este repositorio contiene el backend de una plataforma de taxis, construido con NestJS + TypeScript, diseñado para ser:

Escalable

Modular

Seguro

Fácil de mantener

Funcionalidades principales

✔ Registro e inicio de sesión con JWT
✔ Roles de usuario (user, driver, admin)
✔ Gestión de usuarios y conductores
✔ Gestión de vehículos
✔ Creación y consulta de viajes
✔ Validación con DTOs
✔ Documentación interactiva con Swagger
✔ Arquitectura modular siguiendo buenas prácticas de NestJS

🛠️ Tecnologías Utilizadas

NestJS – Framework principal

TypeScript

JWT Authentication

Prisma u otro ORM (si aplica)

Swagger para documentación

PNPM como manejador de paquetes

📁 Estructura del Proyecto

<details> <summary><strong>📦 Ver estructura del proyecto</strong></summary>
src/
├── auth/           # Autenticación y JWT
├── user/           # Usuarios y roles
├── driver/         # Conductores
├── ride/           # Vehículos
├── roles/          # Roles del sistema
├── common/         # Decoradores, interceptores, pipes
├── app.module.ts
└── main.ts         # Punto de entrada

</details>

Cada módulo incluye controllers, services, DTOs, y esquemas, con una arquitectura totalmente modularizada.

🚀 Instalación
pnpm install

▶️ Ejecutar el Proyecto

# Modo desarrollo

pnpm run start:dev

# Ejecución normal

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

Una vez corriendo el servidor, accede a:

👉 http://localhost:3000/api

Aquí podrás visualizar:

Autenticación (Auth)

Usuarios

Conductores

Vehículos

Roles

Viajes

🔐 Roles en el Sistema
Rol Descripción
user Usuario que solicita viajes
driver Conductor registrado que puede aceptar viajes
admin Administrador con control total del sistema
🌐 Deployment

Para desplegar en producción consulta la guía oficial:

🔗 https://docs.nestjs.com/deployment

📚 Recursos Útiles

Documentación oficial de NestJS: https://docs.nestjs.com/

Repositorio del proyecto: https://github.com/LFernando07/taxi_plataform

📄 Licencia

Este proyecto está licenciado bajo MIT.
