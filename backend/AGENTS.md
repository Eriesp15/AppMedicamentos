# AGENTS.md

## Propósito
Directorio contenedor del servidor API REST backend del proyecto `AppMedicamentos`. Proporciona un servicio de servidor básico para emular el almacenamiento y consumo de tratamientos médicos y perfiles de salud.

## Responsabilidades
- Iniciar y escuchar peticiones HTTP en el puerto configurado (`package.json`, `src/server.js`).
- Administrar el árbol de dependencias del servidor backend (`express`, `helmet`, `cors`, `morgan`).
- Servir de puente de datos para los clientes que no utilicen sincronización directa con Firebase.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [package.json](file:///c:/AppMedicamentos/backend/package.json) | Define los scripts de arranque (`start` y `dev` con nodemon) y las dependencias npm requeridas para la ejecución de la API Express. |

## Dependencias relevantes
- `express` (Framework de enrutamiento y peticiones REST)
- `nodemon` (Herramienta de recarga en caliente para desarrollo)

## Flujo de trabajo
1. El servidor se ejecuta mediante `npm run dev` o `npm start`, lo que dispara `src/server.js`.
2. Las peticiones entrantes de los clientes móviles son procesadas bajo el prefijo de la API y canalizadas al enrutador principal en `src/app.js`.

## Convenciones
- El backend expone una APIREST simple y ligera basada en middlewares modulares.
- Los módulos se dividen siguiendo una arquitectura clásica: Rutas → Controladores → Servicios → Modelos.

## Restricciones
- No utilizar bases de datos pesadas en este nivel; el backend utiliza un adaptador simple en memoria para pruebas rápidas y simulación local.

## Relación con otras carpetas
- [src/](file:///c:/AppMedicamentos/backend/src) → Aloja el código fuente completo del servidor de Node.js.
- [src/services/api.ts (Móvil)](file:///c:/AppMedicamentos/src/services/api.ts) → El cliente móvil React Native se conecta directamente a este backend si la URL apunta a su dirección.
