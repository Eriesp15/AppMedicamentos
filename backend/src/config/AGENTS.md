# AGENTS.md

## Propósito
Centralizar y exponer de forma segura y tipada las variables de entorno y parámetros de configuración del servidor backend.

## Responsabilidades
- Cargar las variables desde el archivo local `.env` utilizando `dotenv`.
- Validar y tipar los parámetros críticos (ej. parsear el puerto HTTP a tipo numérico).
- Exportar el objeto `env` unificado conteniendo las claves de ejecución (`nodeEnv`, `port`, `apiPrefix`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [env.js](file:///c:/AppMedicamentos/backend/src/config/env.js) | Carga dotenv, lee las variables globales del sistema o archivo local y exporta un objeto plano de configuraciones sanitizado. |

## Dependencias relevantes
- `dotenv` (Lector de archivos de entorno `.env`)

## Flujo de trabajo
- Al arrancar la aplicación en `server.js` o configurar express en `app.js`, se importa `config/env.js` para extraer de inmediato los valores de puerto y prefijo requeridos.

## Convenciones
- Toda variable leída de `process.env` debe mapear un valor por defecto seguro (ej. puerto `4000` si `process.env.PORT` está indefinido) para evitar errores fatales de arranque.

## Restricciones
- No colocar llaves de acceso, contraseñas o firmas hardcodeadas en texto plano en este archivo; deben extraerse siempre mediante `process.env`.

## Relación con otras carpetas
- [app.js (Raíz backend/src)](file:///c:/AppMedicamentos/backend/src/app.js) & [server.js (Raíz backend/src)](file:///c:/AppMedicamentos/backend/src/server.js) → Utilizan el prefijo y puerto del objeto `env`.
