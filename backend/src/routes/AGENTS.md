# AGENTS.md

## Propósito
Declarar y mapear los endpoints HTTP de la API, vinculando las URIs y métodos (GET, POST, PUT, DELETE) con sus respectivos controladores y aplicando middlewares de seguridad donde sea requerido.

## Responsabilidades
- Exponer el enrutador global de la API (`apiRouter`) que consolida los sub-enrutadores del sistema.
- Definir qué rutas requieren token de sesión inyectando el middleware `requireAuth` (ej. rutas de perfil y medicamentos).
- Mapear peticiones a los controladores de autenticación, salud y perfil.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [index.js](file:///c:/AppMedicamentos/backend/src/routes/index.js) | Enrutador raíz de la API. Conecta sub-rutas al prefijo común y exporta `apiRouter`. |
| [medication.routes.js](file:///c:/AppMedicamentos/backend/src/routes/medication.routes.js) | Endpoints CRUD protegidos para medicamentos (`/medications`, `/medications/:medicationId`). |
| [auth.routes.js](file:///c:/AppMedicamentos/backend/src/routes/auth.routes.js) | Rutas públicas para el registro e inicio de sesión de usuarios (`/auth/register`, `/auth/login`). |
| [profile.routes.js](file:///c:/AppMedicamentos/backend/src/routes/profile.routes.js) | Endpoints protegidos para la lectura y actualización del perfil clínico del usuario (`/profile`). |
| [health.routes.js](file:///c:/AppMedicamentos/backend/src/routes/health.routes.js) | Ruta de comprobación rápida `/health` para diagnósticos del servidor. |

## Dependencias relevantes
- `express` (Función `Router` para modularizar endpoints)
- `../middlewares/auth.middleware` (Middleware `requireAuth` para denegar accesos anónimos)
- `../controllers/` (Los controladores destino de las llamadas HTTP)

## Flujo de trabajo
1. Express recibe la solicitud y la pasa a `apiRouter` (`routes/index.js`).
2. El enrutador evalúa el segmento de ruta. Por ejemplo, si es `/medications`, lo delega a `medication.routes.js`.
3. El enrutador específico aplica el middleware `requireAuth` para validar el token Bearer.
4. Si el token es válido, se invoca al método de acción del controlador respectivo (ej. `list` o `create`).

## Convenciones
- Utilizar nombres de rutas en plural para endpoints de recursos (ej. `/medications` en lugar de `/medication`).
- Modularizar cada recurso del sistema en su propio archivo de rutas para mantener la legibilidad de la API.

## Restricciones
- No colocar lógica de controladores ni procesamiento directo de respuestas dentro de las rutas; delegar siempre en la capa de controladores.

## Relación con otras carpetas
- [app.js (Raíz backend/src)](file:///c:/AppMedicamentos/backend/src/app.js) → Importa e instala `apiRouter` dentro del servidor express.
- [controllers/](file:///c:/AppMedicamentos/backend/src/controllers) → Consumidos por las rutas para procesar las peticiones.
- [middlewares/](file:///c:/AppMedicamentos/backend/src/middlewares) → Aplicados para filtrar solicitudes no autorizadas en endpoints específicos.
