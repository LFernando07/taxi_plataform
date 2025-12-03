🚖 Taxi Platform – Backend API

API backend para la gestión completa de una plataforma de taxis, construida con NestJS.
Incluye autenticación JWT, manejo de roles (user, driver, admin), administración de conductores, vehículos y viajes, y documentación integrada con Swagger.

✨ Características principales

- Autenticación con JWT

- Sistema de roles: user, driver, admin

- Gestión de usuarios

- Gestión de conductores

- Gestión de vehículos

- Creación y seguimiento de viajes

- Validación por DTOs

- Arquitectura modular de NestJS

- Documentación automática con Swagger

- Buenas prácticas de estructura y organización del código

👨‍💻 Tecnologías utilizadas

- NestJS

- TypeScript

- JWT Authentication

- TypeORM

- PostgreSQL

- Swagger

- PNPM

<details> <summary><b>📦 Estructura del proyecto</b></summary>
taxi_plataform/
├── src/
│   ├── auth/           # Autenticación y JWT
│   ├── user/           # Usuarios y perfiles
│   ├── driver/         # Conductores
│   ├── ride/           # Vehículos
│   ├── roles/          # Sistema de roles
│   ├── common/         # Decoradores / Interceptores / Pipes / Exceptions
│   ├── app.module.ts
│   └── main.ts         # Punto de entrada
├── test/               # Pruebas unitarias y e2e
├── .env.example
├── package.json
├── pnpm-lock.yaml
└── README.md

</details>
🧰 Get Started
⚙️ Requisitos previos

📌 Backend
Debes declarar en un archivo .env:

JWT_SECRET

JWT_EXPIRES

DATABASE_URL (si usas Prisma)

Si trabajas con ORM Prisma, recuerda ejecutar:

pnpm prisma generate
pnpm prisma migrate dev

🪛 Instalación

Paso 1 — Clona el repositorio

git clone https://github.com/LFernando07/taxi_plataform.git

Paso 2 — Instala dependencias

pnpm install

Paso 3 — Ejecuta el servidor en modo desarrollo

pnpm run start:dev

El backend estará disponible en:

👉 http://localhost:3000

📄 Documentación Swagger

Una vez iniciado el servidor, accede a:

👉 http://localhost:3000/api

Aquí verás todos los endpoints de:

- Autenticación

- Usuarios

- Conductores

- Roles

- Viajes

🔒 Environment Variables

Crea un archivo .env en la raíz:

# Token

JWT_SECRET=yourSecretKey
JWT_EXPIRES=1d

# DB (solo si usas prisma o base relacional)

DATABASE_URL=postgresql://user:pass@localhost:5432/taxi

🧪 Testing

# Unit tests

pnpm run test

# End-to-end

pnpm run test:e2e

# Cobertura

pnpm run test:cov

👥 Roles del sistema
Rol Descripción

- user Usuario normal, solicita viajes
- driver Conductor del servicio
- admin Acceso total y gestión completa del sistema
  📚 Recursos útiles

Swagger UI → http://localhost:3000/api

Repo del proyecto → https://github.com/LFernando07/taxi_plataform

📋 Licencia

Este proyecto está bajo la licencia MIT.
