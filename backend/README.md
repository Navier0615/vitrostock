# Backend: Guía de arquitectura

**Arquitectura:** por capas (Layered Architecture) organizada en módulos por
feature (Feature-based / Modular). Variante de MVC adaptada a una API REST, con
capa de servicios para la lógica de negocio.

Backend en Node.js + Express organizado por **capas** y **módulos**.
Este README explica cómo está armado y cómo trabajar en él sin pisarnos.

# Backend: Guía de arquitectura

Backend en Node.js + Express organizado por **capas** y **módulos**.
Este README explica cómo está armado y cómo trabajar en él sin pisarnos.

---

## 1. La idea en una frase

Cada **módulo** es un área del negocio (usuarios, tareas, pagos...).
Dentro de cada módulo el código se divide en **capas**, y cada capa tiene un solo trabajo.

---

## 2. Estructura de carpetas

```
backend/
├── src/
│   ├── modules/              ← una carpeta por área del negocio
│   │   ├── auth/
│   │   ├── <modulo-2>/
│   │   └── <modulo-3>/
│   ├── middlewares/          ← código compartido que corre "en medio" de las peticiones
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── config/               ← configuración compartida
│   │   ├── env.js
│   │   └── db.js
│   ├── utils/                ← funciones de ayuda compartidas
│   │   └── response.js
│   ├── routes.js             ← registra todos los módulos
│   ├── app.js                ← configura Express
│   └── server.js             ← levanta el servidor
├── tests/
└── README.md
```

| Concepto | En nuestro proyecto |
|---|---|
| Capas | routes → controller → service → model |
| Módulos | una carpeta por entidad en `src/modules/` |
| Relación con MVC | Controller = C, Model = M, la V es el JSON de respuesta; el service es una capa extra |

### Qué es cada carpeta de afuera

| Carpeta / archivo | Para qué sirve |
|---|---|
| `modules/` | Aquí vive el 90% del trabajo. Una carpeta por entidad/área. |
| `middlewares/` | Funciones que se ejecutan antes o después del controller (verificar token, validar datos, manejar errores). |
| `config/` | Leer variables de entorno y conectar a la base de datos. Se hace una vez. |
| `utils/` | Helpers reutilizables (por ejemplo, armar la respuesta estándar). |
| `routes.js` | Punto donde se conecta cada módulo a su URL base. |
| `app.js` | Arma la app de Express (JSON, CORS, rutas, errores). No levanta el puerto. |
| `server.js` | Importa `app.js` y levanta el puerto. Separado para poder testear la app. |

---

## 3. Anatomía de un módulo

Todos los módulos tienen **los mismos 5 archivos**:

```
modules/<modulo>/
├── <modulo>.routes.js        ← URLs
├── <modulo>.controller.js    ← recibe y responde
├── <modulo>.service.js       ← lógica de negocio
├── <modulo>.model.js         ← acceso a la base de datos
└── <modulo>.validation.js    ← qué datos son válidos
```

### Qué hace cada archivo (y qué NO debe hacer)

| Archivo | Hace | NO hace |
|---|---|---|
| **routes** | Define las URLs y a qué función del controller apunta cada una. | Lógica, validaciones a mano, acceso a BD. |
| **controller** | Lee `req`, llama al service, arma la respuesta con `res`. | Lógica de negocio, consultas a la BD. |
| **service** | Toda la lógica de negocio: reglas, cálculos, decisiones. Llama al model. | Tocar `req` o `res`. Ni siquiera debe saber que existe HTTP. |
| **model** | Define cómo se guardan los datos y habla con la BD. | Reglas de negocio. |
| **validation** | Define con Zod qué forma deben tener los datos de entrada. | Nada más; solo esquemas. |

---

## 4. Cómo viaja una petición

```
Cliente (app móvil)
      │
      ▼
   routes         → ¿a qué URL llegó? → elige el controller
      │
      ▼
 middlewares      → ¿el token es válido? ¿los datos son válidos?
      │
      ▼
  controller      → saca los datos de req y llama al service
      │
      ▼
   service        → aplica las reglas de negocio
      │
      ▼
   model          → guarda o lee de la base de datos
      │
      ▼
   (la respuesta vuelve por el mismo camino hasta el cliente)
```

Regla de oro: **cada capa solo le habla a la de abajo.**
El controller llama al service, el service llama al model. Nunca al revés, y nunca saltándose una capa (el controller no llama directo al model).

---

## 5. Ejemplo completo: módulo `tasks`

Petición: `POST /api/v1/tasks` con `{ "title": "Estudiar" }`

**`tasks.validation.js`**
```js
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1),
});
```

**`tasks.routes.js`**
```js
import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { createTaskSchema } from './tasks.validation.js';
import { createTask, getTasks } from './tasks.controller.js';

const router = Router();

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);

export default router;
```

**`tasks.controller.js`**
```js
import * as tasksService from './tasks.service.js';

export async function createTask(req, res) {
  const task = await tasksService.create(req.body);
  res.status(201).json({ ok: true, data: task });
}

export async function getTasks(req, res) {
  const tasks = await tasksService.findAll();
  res.json({ ok: true, data: tasks });
}
```

**`tasks.service.js`**
```js
import { Task } from './tasks.model.js';

export async function create(data) {
  return Task.create(data);
}

export async function findAll() {
  return Task.find();
}
```

**`tasks.model.js`**
```js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  done: { type: Boolean, default: false },
});

export const Task = mongoose.model('Task', taskSchema);
```

> El model de arriba es un ejemplo con Mongoose. Se ajusta a la BD que elijamos.

---

## 6. Cómo agregar cosas

### A) Feature nueva de algo que YA tiene módulo
Ejemplo: "marcar tarea como completada" dentro de `tasks`.

No se crean archivos nuevos. Se agrega contenido en los que ya existen:

1. `tasks.routes.js` → agregar la ruta: `router.patch('/:id/complete', completeTask);`
2. `tasks.controller.js` → agregar la función `completeTask`.
3. `tasks.service.js` → agregar la función `complete`.
4. `tasks.validation.js` → agregar el schema, si recibe datos.

### B) Cosa nueva (entidad nueva)
Ejemplo: comentarios en las tareas.

1. Crear la carpeta `modules/comments/` con los 5 archivos.
2. Registrarla en `src/routes.js`:
```js
   import commentsRoutes from './modules/comments/comments.routes.js';
   router.use('/comments', commentsRoutes);
```

### ¿Cómo decidir entre A y B?

Preguntarse: **¿de qué "cosa" trata esto?**

| Feature | Decisión |
|---|---|
| Marcar tarea como completada | A: es de `tasks` |
| Borrar tarea | A: es de `tasks` |
| Filtrar tareas por fecha | A: es de `tasks` |
| Comentarios en tareas | B: es una entidad distinta |
| Notificaciones | B: entidad distinta |

Un módulo es **una entidad o área del negocio**, no una feature suelta.

---

## 7. Reglas de convivencia

1. **Cada persona es dueña de un módulo.** Trabajamos en nuestra carpeta para no generar conflictos de merge.
2. **Un módulo NO importa el model de otro módulo.** Si `tasks` necesita datos de `auth`, llama al **service** de `auth`, no a su model.
3. **Los controllers no tienen lógica de negocio.** Solo reciben, delegan y responden.
4. **Los services no conocen `req` ni `res`.** Reciben datos normales y devuelven datos normales.
5. **Todos los endpoints responden con el mismo formato:**
```json
   { "ok": true,  "data": { } }
   { "ok": false, "error": { "message": "...", "code": "..." } }
```
6. **La API está versionada:** todas las rutas cuelgan de `/api/v1`.
7. **Cero credenciales en el código.** Todo va en variables de entorno (`.env`, que NO se sube al repo).
8. **Lo compartido (`middlewares/`, `config/`, `utils/`) se cambia con cuidado:** avisar al equipo antes, porque afecta a todos.

---

## 8. Flujo de trabajo con Git (GitFlow)

- `main` → versión estable / entregas.
- `develop` → integración del trabajo de todos.
- `feature/<nombre>` → una rama por tarea, salen de `develop` y vuelven a `develop` por Pull Request.

Ejemplo:
```
git checkout develop
git pull
git checkout -b feature/tasks-complete
# ...trabajar...
git push origin feature/tasks-complete
# abrir Pull Request hacia develop
```

Nunca se hace push directo a `main` ni a `develop`.

---

## 9. Checklist antes de abrir un Pull Request

- [ ] Mi código está solo en mi módulo (o avisé si toqué algo compartido).
- [ ] El controller no tiene lógica de negocio.
- [ ] El service no usa `req` ni `res`.
- [ ] Los endpoints responden con el formato `{ ok, data, error }`.
- [ ] No hay credenciales ni URLs hardcodeadas.
- [ ] Probé mis endpoints y funcionan.