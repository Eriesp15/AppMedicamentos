# AGENTS.md

## Propósito
Directorio principal del código fuente de la API backend de Node.js / Express. Agrupa la configuración de arranque de Express, los enrutadores, la lógica de controladores, middlewares de validación, servicios y la base de datos simulada.

## Responsabilidades
- Configurar la aplicación Express, middlewares de seguridad (`helmet`), intercambio de recursos (`cors`) y registro de logs (`morgan`).
- Inicializar la escucha del puerto HTTP e iniciar el servidor (`server.js`).
- Estructurar el ruteo de endpoints de la API (`/api/v1/...`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [app.js](file:///c:/AppMedicamentos/backend/src/app.js) | Configura la instancia Express, vincula los middlewares globales e integra el enrutador principal en el prefijo de la API. |
| [server.js](file:///c:/AppMedicamentos/backend/src/server.js) | Archivo ejecutable de arranque. Importa la app configurada y levanta el servidor HTTP en el puerto indicado en la configuración. |

## Dependencias relevantes
- `express` (Framework HTTP core)
- `helmet` (Seguridad básica de cabeceras HTTP)
- `cors` (Permiso para peticiones cruzadas desde emuladores/dispositivos)
- `morgan` (Registrador de solicitudes HTTP en consola)

## Flujo de trabajo
1. `server.js` importa a `app.js` y arranca la escucha HTTP.
2. Una petición del cliente entra a `app.js`, pasa por los middlewares globales y es derivada al enrutador principal (`routes/index.js`).
3. El enrutador delega el control al archivo de rutas específico (por ejemplo, `routes/medication.routes.js`), el cual a su vez invoca a un controlador en `controllers/`.

## Convenciones
- Toda configuración de entorno debe ser leída a través de `config/env.js` en lugar de acceder directamente a `process.env`.
- Todos los módulos de la aplicación deben utilizar importaciones de estilo CommonJS (`require` / `module.exports`).

## Restricciones
- No utilizar la instancia global de Express fuera de `app.js` para evitar duplicación de servidores.

## Relación con otras carpetas
- [config/](file:///c:/AppMedicamentos/backend/src/config) → Provee las variables de puerto y prefijo de API.
- [routes/](file:///c:/AppMedicamentos/backend/src/routes) → Dirige las peticiones entrantes a sus respectivos destinos.
- [controllers/](file:///c:/AppMedicamentos/backend/src/controllers) → Contiene las respuestas y respuestas a clientes de la API.
