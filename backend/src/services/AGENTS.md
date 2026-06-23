# AGENTS.md

## Propósito
Centralizar la lógica de negocio, manipulación algorítmica y acceso al repositorio de datos del servidor backend.

## Responsabilidades
- Gestionar la autenticación de usuarios: buscar credenciales por correo electrónico, validar contraseñas y mapear tokens de sesión activos (`auth.service.js`).
- Administrar la manipulación de registros de medicamentos en base de datos: insertar, filtrar, modificar campos y eliminarlos de la memoria (`medication.service.js`).
- Obtener y modificar el perfil médico de un usuario registrado (`profile.service.js`).
- Proveer estadísticas internas simples de estado del sistema (`health.service.js`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [medication.service.js](file:///c:/AppMedicamentos/backend/src/services/medication.service.js) | Lógica CRUD de medicamentos. Filtra registros por ID de usuario e interactúa directamente con el objeto de base de datos en memoria `db`. |
| [auth.service.js](file:///c:/AppMedicamentos/backend/src/services/auth.service.js) | Lógica de autenticación. Valida contraseñas en texto plano, asocia tokens simulados y recupera usuarios de la sesión activa en memoria. |
| [profile.service.js](file:///c:/AppMedicamentos/backend/src/services/profile.service.js) | Lógica de consulta y actualización de los datos de salud del paciente. |
| [health.service.js](file:///c:/AppMedicamentos/backend/src/services/health.service.js) | Provee información simple del estado de ejecución (por ejemplo, el tiempo de actividad del servidor en segundos). |

## Dependencias relevantes
- `../models/inMemoryDb` (Consume el modelo y base de datos simulada en memoria)
- `crypto` (Módulo nativo de Node.js para generación de IDs UUID aleatorios)

## Flujo de trabajo
- Los servicios son invocados directamente por la capa de controladores (`controllers/`). Reciben datos limpios y se encargan de ejecutar las transformaciones y validaciones de lógica interna (ej. eliminar espacios con `.trim()`, formatear fechas en formato ISO) antes de realizar escrituras o lecturas en `inMemoryDb.js`.

## Convenciones
- Los servicios no deben leer ni manipular directamente peticiones HTTP (`req`) ni cabeceras; deben recibir parámetros planos de función (`userId`, `payload`, etc.) para mantener la separación de responsabilidades y facilitar pruebas unitarias.

## Restricciones
- No manejar contraseñas cifradas con algoritmos de hashing en esta versión de pruebas (se evalúan en texto plano en `auth.service.js`).

## Relación con otras carpetas
- [models/](file:///c:/AppMedicamentos/backend/src/models) → Interactúa directamente con la persistencia en memoria.
- [controllers/](file:///c:/AppMedicamentos/backend/src/controllers) → Invoca a los servicios descritos en este directorio para satisfacer los endpoints de la API.
