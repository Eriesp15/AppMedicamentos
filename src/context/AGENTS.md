# AGENTS.md

## Propósito
Proveer mecanismos de estado global a través de la API Context de React. Administra configuraciones globales de la app que afectan transversalmente el estilo, accesibilidad, y comportamiento de los componentes.

## Responsabilidades
- Mantener en memoria el estado actual de las configuraciones de usuario (`AppSettings`).
- Persistir cambios de configuraciones en almacenamiento local de forma automática.
- Calcular factores dinámicos basados en la configuración actual: escala de fuentes (`fontScale`), tamaño de área de toque (`largeTouch`), y visibilidad de bordes (`highVisibilityBorders`).
- Proveer los estilos dinámicos globales recalculados (`styles`) y la paleta de colores activa (`palette`) a todos los componentes hijos.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [AppSettingsContext.tsx](file:///c:/AppMedicamentos/src/context/AppSettingsContext.tsx) | Implementa `AppSettingsProvider` y el gancho `useAppSettings`. Inicializa configuraciones por defecto, escucha cambios, y expone funciones para actualizar configuraciones individuales. |

## Dependencias relevantes
- `@react-native-async-storage/async-storage` (Persistencia persistente del estado de configuraciones)
- `../constants/themePalettes` (Para la resolución de temas activos)
- `../styles/createAppStyles` (Para recalcular los estilos de UI de forma dinámica)
- `../types/settings` (Definición tipada del estado de configuración)

## Flujo de trabajo
1. `App` en `App.tsx` envuelve la app móvil dentro de `<AppSettingsProvider>`.
2. Al montarse, el proveedor lee las configuraciones desde `AsyncStorage` y las carga en el estado local.
3. Cada vez que cambian las configuraciones de accesibilidad (por ejemplo, al activar la fuente grande o el contraste alto), el hook `useMemo` recalcula la paleta de colores y genera un nuevo objeto `StyleSheet` usando `createAppStyles`.
4. Cualquier pantalla o componente que use el hook `useAppSettings` se vuelve a renderizar con la nueva paleta y los estilos adaptados.

## Convenciones
- El hook `useAppSettings` debe utilizarse en lugar de importar estilos estáticos o directos para cualquier elemento interactivo que dependa de accesibilidad.
- Al añadir una nueva opción de configuración, se debe declarar en `AppSettings` de los tipos y agregar su respectivo valor inicial en `DEFAULT_APP_SETTINGS`.

## Restricciones
- No almacenar información de negocio ni datos de medicamentos en este contexto; está acotado exclusivamente a configuraciones del sistema, temas y accesibilidad.
- No disparar escrituras en bucle infinito hacia `AsyncStorage`.

## Relación con otras carpetas
- [styles/](file:///c:/AppMedicamentos/src/styles) → Invoca a `createAppStyles.ts` para la regeneración dinámica del StyleSheet de React Native.
- [constants/](file:///c:/AppMedicamentos/src/constants) → Consume las paletas de temas definidas en `themePalettes.ts`.
- [types/](file:///c:/AppMedicamentos/src/types) → Utiliza las firmas de tipos declaradas para la consistencia del estado.
