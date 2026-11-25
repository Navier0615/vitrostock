# VitroStock

Sistema de gestión de inventario y contabilidad para **Vidrios y Aluminios Estelar**.
Proyecto académico de la Electiva V, Institución Universitaria Colegio Mayor del Cauca (Unimayor).

El negocio llevaba el inventario en Excel y la contabilidad en cuadernos. VitroStock reúne en
una app móvil el catálogo de productos, el stock, los proveedores, los clientes y las cuentas
por pagar y por cobrar.

## Equipo

| Integrante | GitHub |
|---|---|
| Jessica González | [@Navier0615](https://github.com/Navier0615) |
| Juan Ordoñez | [@Juancho7](https://github.com/Juancho7) |
| Cristian Sánchez | [@nowchri](https://github.com/nowchri) |

## Funcionalidades

| Módulo | Qué permite hacer |
|---|---|
| Inventario | Registrar productos con stock inicial, consultar el stock y registrar entradas |
| Proveedores | Registrar, listar y ver el detalle de cada proveedor |
| Cuentas por pagar | Registrar deudas con proveedores y ver su estado |
| Clientes | Registrar, listar y ver el detalle de cada cliente |
| Cuentas por cobrar | Registrar lo que deben los clientes y ver su estado |

## Tecnologías

- **App móvil:** React Native con Expo y TypeScript.
- **Backend:** Node.js + Express, validación con Zod.
- **Base de datos:** PostgreSQL.
- **Despliegue:** Docker Compose y GitHub Actions (CI/CD a un VPS).

## Estructura del repositorio

```
vitrostock/
├── backend/                  API REST (Node.js + Express)
│   ├── database/schema.sql   Tablas de la base de datos
│   └── src/
│       ├── modules/          Un módulo por área: producto, proveedor, cliente,
│       │                     cuenta-pagar, cuentas-cobrar, auth
│       │                     (cada uno con routes, controller, service, model, validation)
│       ├── middlewares/      Validación, manejo de errores y autenticación
│       ├── config/           Variables de entorno y conexión a la BD
│       └── utils/            Formato común de las respuestas
├── mobile/                   App móvil (Expo)
│   ├── App.tsx               Navegación por pestañas y pantallas
│   ├── screens/              Una pantalla por vista (listas, detalle, formularios)
│   ├── components/           Componentes reutilizables (FAB, TabBar, Formulario, ítems de lista)
│   ├── hooks/                Hooks propios que cargan los datos (useStock, useClientes...)
│   ├── services/             Llamadas a la API
│   ├── types/                Tipos de TypeScript de cada entidad
│   ├── utils/                Confirmaciones, avisos y formato de valores
│   └── config/api.ts         URL del backend
├── docs/                     Documentación del proyecto (requisitos, modelo de datos, Jira)
├── .github/workflows/        CI/CD de develop y master
└── docker-compose.yml        Backend + PostgreSQL
```

En la app, cada pantalla usa un hook propio para cargar los datos, el hook llama a un servicio
y el servicio consume la API. En el backend, cada petición pasa por
`routes → controller → service → model`. Más detalle en [backend/README.md](backend/README.md).

## Cómo ejecutarlo

### 1. Backend y base de datos (con Docker)

```bash
cp .env.example .env        # poner una contraseña en DB_PASSWORD
docker compose up -d --build
```

La API queda en `http://localhost:8082/api/v1` (el puerto sale de `APP_PORT` en `.env`).
La primera vez, PostgreSQL crea las tablas con `backend/database/schema.sql`.

<details>
<summary>Sin Docker (con PostgreSQL instalado en el PC)</summary>

```bash
cd backend
cp .env.example .env        # ajustar los datos de conexión
npm install
npm run dev                 # API en http://localhost:3000/api/v1
```

Antes hay que crear la base `vitrostock` y ejecutar `database/schema.sql`.
</details>

### 2. App móvil

```bash
cd mobile
cp .env.example .env        # EXPO_PUBLIC_API_URL = URL de la API
npm install
npx expo start
```

Escanear el código QR con Expo Go. En un celular físico `localhost` no funciona:
en `EXPO_PUBLIC_API_URL` hay que poner la IP del PC, por ejemplo `http://192.168.1.10:8082/api/v1`.

## Endpoints principales

Todos bajo `/api/v1`:

| Recurso | Rutas |
|---|---|
| Productos | `GET /productos`, `GET /productos/stock?nombre=`, `GET /productos/:id`, `POST /productos`, `POST /productos/:id/entradas` |
| Proveedores | `GET /proveedores`, `GET /proveedores/:id`, `POST /proveedores` |
| Cuentas por pagar | `GET /cuentas-pagar`, `GET /cuentas-pagar/:id`, `POST /cuentas-pagar`, `PATCH /cuentas-pagar/:id/pagar` |
| Clientes | `GET /clientes`, `GET /clientes/:id`, `POST /clientes` |
| Cuentas por cobrar | `GET /cuentas-cobrar`, `GET /cuentas-cobrar/cliente/:clienteId`, `POST /cuentas-cobrar`, `PATCH /cuentas-cobrar/:id/pagar`, `PATCH /cuentas-cobrar/:id/estado` |

## Flujo de trabajo con Git

Usamos GitFlow:

- `master`: producción. Cada push despliega en el VPS.
- `develop`: integración. Cada push despliega el ambiente de desarrollo.
- `feature/*` y `fix/*`: una rama por funcionalidad, creada desde `develop` y unida con Pull Request.

Los commits siguen Conventional Commits en español, por ejemplo
`feat(mobile): registrar productos y consultar stock desde la app`.
