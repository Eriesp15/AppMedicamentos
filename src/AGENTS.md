# AGENTS.md

## Propósito
Directorio contenedor principal del código fuente de la aplicación móvil React Native. Agrupa la arquitectura del lado del cliente dividida en componentes, pantallas, ganchos de estado (hooks), persistencia, estilos, constantes y utilidades.

## Responsabilidades
- Organizar la estructura de código fuente de la aplicación en módulos funcionales diferenciados.
- Aislar la capa de interfaz de usuario (`components/`, `screens/`, `styles/`) de la lógica de persistencia (`storage/`) y de servicios nativos (`services/`).
- Servir de puente de importación para el componente principal `App.tsx` ubicado en la raíz del proyecto.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| *Ninguno* | Este directorio sirve únicamente como contenedor estructurado de carpetas. Toda la lógica reside en los subdirectorios. |

## Dependencias relevantes
- No posee dependencias directas de archivos en este nivel. Las dependencias se importan a nivel de subdirectorio.

## Flujo de trabajo
- Este directorio estructura el flujo de importaciones: las pantallas (`screens/`) utilizan componentes (`components/`), que consumen lógica a través de hooks (`hooks/`), que a su vez se apoyan en servicios (`services/`) y persistencia (`storage/`).

## Convenciones
- Todos los subdirectorios de primer nivel deben estar escritos en minúsculas (por ejemplo, `components`, `screens`, `hooks`).
- No colocar archivos de lógica sueltos directamente bajo `src/`; deben ir clasificados en su respectivo subdirectorio.

## Restricciones
- No crear archivos `.tsx` ni `.ts` en la raíz de `src/` para mantener la limpieza de la estructura arquitectónica.

## Relación con otras carpetas
- [components/](file:///c:/AppMedicamentos/src/components) → UI reutilizable.
- [screens/](file:///c:/AppMedicamentos/src/screens) → Pantallas completas y contenedores de vistas de la app.
- [hooks/](file:///c:/AppMedicamentos/src/hooks) → Lógica de estado compartida.
- [services/](file:///c:/AppMedicamentos/src/services) → APIs nativas y externas.
- [storage/](file:///c:/AppMedicamentos/src/storage) → Base de datos local y Firebase Firestore.
- [constants/](file:///c:/AppMedicamentos/src/constants) → Constantes fijas de la app.
- [context/](file:///c:/AppMedicamentos/src/context) → Estado global (proveedores React).
- [styles/](file:///c:/AppMedicamentos/src/styles) → Definición de estilos reutilizables.
- [types/](file:///c:/AppMedicamentos/src/types) → Interfaces y modelos TS.
- [utils/](file:///c:/AppMedicamentos/src/utils) → Funciones de ayuda generales.
