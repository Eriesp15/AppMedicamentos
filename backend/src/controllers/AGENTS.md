# AGENTS.md

## Propósito
Alojar los controladores HTTP del servidor API, los cuales se encargan de recibir las solicitudes de los clientes móviles, extraer parámetros y cuerpos de mensajes, validar campos requeridos y estructurar las respuestas REST devueltas (estados HTTP, JSON o payloads vacíos).

## Responsabilidades
- Procesar solicitudes de inicio de sesión y registro de usuarios (`auth.controller.js`).
- Exponer respuestas rápidas de estado de salud e integridad del servidor (`health.controller.js`).
- Administrar el ciclo de vida CRUD de los medicamentos de cada usuario (`medication.controller.js`).
- Responder y modificar los datos de perfil clínico de los pacientes (`profile.controller.js`).
- Traducir los resultados devueltos por la capa de servicios a códigos de estado HTTP semánticos (ej. `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [medication.controller.js](file:///c:/AppMedicamentos/backend/src/controllers/medication.controller.js) | Controla el flujo de creación, lectura, modificación y eliminación (CRUD) de tratamientos asociados a un usuario específico. |
| [auth.controller.js](file:///c:/AppMedicamentos/backend/src/controllers/auth.controller.js) | Maneja el registro de nuevos usuarios y la obtención de credenciales de sesión en la base de datos simulada. |
| [profile.controller.js](file:///c:/AppMedicamentos/backend/src/controllers/profile.controller.js) | Gestiona la lectura y guardado de perfiles médicos (tipos de sangre, alergias, etc.). |
| [health.controller.js](file:///c:/AppMedicamentos/backend/src/controllers/health.controller.js) | Endpoint de verificación rápida (ping/pong) para comprobar la disponibilidad operativa del backend. |

## Dependencias relevantes
- `../services/` (Los archivos correspondientes de lógica de negocio y base de datos)

## Flujo de trabajo
1. El enrutador (`routes/`) direcciona la petición entrante a una función del controlador (ej. `create` en `medication.controller.js`).
2. El controlador extrae el cuerpo (`req.body`), verifica que no falten parámetros obligatorios (como `name` o `dosage`).
3. Invoca la función del servicio respectivo (ej. `createMedication`) pasándole el identificador de usuario verificado (`req.user.id`).
4. Si el servicio retorna el objeto creado, responde con código `201` y serializa el medicamento en formato JSON; de lo contrario, retorna un error descriptivo.

## Convenciones
- Los controladores no deben realizar modificaciones directas en la base de datos ni contener lógica algorítmica compleja; deben delegar esas tareas a la capa de servicios.
- Retornar siempre respuestas formateadas y consistentes con la estructura JSON predecible.

## Restricciones
- Nunca exponer errores nativos o trazas del compilador en las respuestas HTTP a producción; atrapar excepciones con bloques try/catch y responder con mensajes genéricos controlados.

## Relación con otras carpetas
- [routes/](file:///c:/AppMedicamentos/backend/src/routes) → Declara los endpoints y mapea las peticiones directamente a los controladores de este directorio.
- [services/](file:///c:/AppMedicamentos/backend/src/services) → Proporciona a los controladores las funciones de acceso y lógica a los datos del sistema.
