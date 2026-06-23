# AGENTS.md

## Propósito
Administrar la persistencia de datos en memoria para la simulación del servidor REST. Proporciona una base de datos temporal para fines de desarrollo rápido, pruebas y demostración.

## Responsabilidades
- Mantener colecciones en memoria (`arrays`) para usuarios, perfiles clínicos de pacientes y medicamentos.
- Proporcionar funciones auxiliares para instanciar y sembrar usuarios con estructuras por defecto (`createUser`).
- Generar identificadores únicos universales (`UUID`) para los nuevos registros del sistema.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [inMemoryDb.js](file:///c:/AppMedicamentos/backend/src/models/inMemoryDb.js) | Define el almacén `db` global y expone métodos de escritura cruda. Auto-inicializa el perfil del usuario al registrarse en el sistema. |

## Dependencias relevantes
- `crypto` (Módulo nativo de Node.js, utilizado para generar IDs aleatorios con `randomUUID`)

## Flujo de trabajo
- Los servicios del backend (`services/`) importan directamente el objeto `db` y manipulan sus colecciones (`db.users`, `db.medications`, etc.) utilizando funciones nativas de arreglos JS (ej. `push`, `find`, `filter`).

## Convenciones
- El almacén `db` es volátil; reiniciar el proceso de Node.js restablecerá el estado a colecciones vacías.
- Los correos de los usuarios deben normalizarse a minúsculas antes de insertarse en la colección.

## Restricciones
- Al ser una base de datos en memoria, no utilizar para entornos de producción reales que requieran almacenamiento histórico duradero.
- No mutar el esquema de los arreglos del objeto `db` sin actualizar en paralelo el perfil inicial creado en `createUser`.

## Relación con otras carpetas
- [services/](file:///c:/AppMedicamentos/backend/src/services) → Consume y manipula directamente el objeto `db` de esta carpeta para simular las consultas SQL/NoSQL.
