# AGENTS.md

## Propósito
Administrar el sistema de diseño visual de la aplicación móvil. Implementa la generación dinámica de estilos React Native para soportar de manera unificada temas (Claro/Oscuro/Alto Contraste) y configuraciones de accesibilidad física (fuente escalable y áreas de toque agrandadas).

## Responsabilidades
- Generar el objeto `StyleSheet` centralizado de la aplicación a partir de parámetros visuales dinámicos (`createAppStyles`).
- Calcular márgenes, rellenos y tipografías responsivas según el factor de escalado de pantalla (`fontScale`).
- Modificar el grosor de los bordes y colores basados en las preferencias de accesibilidad del usuario.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [createAppStyles.ts](file:///c:/AppMedicamentos/src/styles/createAppStyles.ts) | Función generadora de estilos. Recibe la paleta de colores activa (`ThemePalette`) y banderas de accesibilidad para compilar y retornar el diccionario de clases de diseño (`StyleSheet`) consumido por las pantallas y componentes. |

## Dependencias relevantes
- `react-native` (Módulo `StyleSheet` para la compilación nativa de estilos)
- `../constants/themePalettes` (Declaración tipada de `ThemePalette`)

## Flujo de trabajo
1. Cuando la aplicación arranca o el usuario cambia el tema/tamaño de letra en configuración, `AppSettingsContext.tsx` es notificado.
2. El contexto invoca a `createAppStyles` pasando la paleta de colores resuelta (`ThemePalette`), el multiplicador de escala de fuente, y las banderas de interacción.
3. `createAppStyles` realiza cálculos aritméticos rápidos para ajustar los pixeles (ej. `fontSize: Math.round(18 * fontScale)`) y los componentes se vuelven a renderizar con la nueva hoja de estilos inyectada.

## Convenciones
- Toda regla de estilo que deba reaccionar a la accesibilidad o al tema de color (fondos, fuentes, bordes) debe incluirse dentro del archivo `createAppStyles.ts`. No colocar estilos en línea (`style={{...}}`) dentro de las pantallas para estos propósitos.
- Usar nombres de clases semánticas coherentes (ej. `container`, `card`, `greetingTitle`, `primaryButton`).

## Restricciones
- No utilizar la clase global `StyleSheet.create` de React Native de forma estática en los archivos de componentes; en su lugar, invocar y depender de los estilos devueltos dinámicamente por el contexto `useAppSettings()`.
- Respetar la fuente tipográfica corporativa/de sistema configurada (ej. `Outfit-Bold` u `Outfit-Regular`) definida en el generador.

## Relación con otras carpetas
- [constants/](file:///c:/AppMedicamentos/src/constants) → Consume la definición de tipos de paletas e interfaces.
- [context/](file:///c:/AppMedicamentos/src/context) → Es invocado directamente por el proveedor de configuración al cambiar el estado.
- [components/](file:///c:/AppMedicamentos/src/components) & [screens/](file:///c:/AppMedicamentos/src/screens) → Obtienen y mapean el StyleSheet resultante a las etiquetas visuales de React Native.
