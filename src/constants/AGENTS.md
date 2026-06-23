# AGENTS.md

## Propósito
Centralizar todas las definiciones de datos estáticos, listados predeterminados para selectores, constantes de configuración local, combinaciones de temas de color y esquemas de paletas visuales para la aplicación.

## Responsabilidades
- Proveer catálogos constantes de medicamentos, unidades de medida y frecuencias horarias.
- Definir las llaves de persistencia en almacenamiento local (`AsyncStorage`).
- Almacenar los esquemas de color y temas visuales (`Light`, `Dark` y `High Contrast`) para toda la aplicación.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [data.ts](file:///c:/AppMedicamentos/src/constants/data.ts) | Alberga catálogos precargados de nombres comerciales de medicamentos (`MEDICATION_DATABASE`), opciones de sonidos de alarma, frecuencias horarias (`cada8h`, `cada12h`, `otra`), límites de longitud de caracteres de entrada y llaves de almacenamiento (`STORAGE_KEYS`). |
| [themePalettes.ts](file:///c:/AppMedicamentos/src/constants/themePalettes.ts) | Define las paletas completas de colores de UI para los modos Claro, Oscuro y Alto Contraste, así como la función para resolver el tema activo. |
| [theme.ts](file:///c:/AppMedicamentos/src/constants/theme.ts) | Define la paleta de colores crudos básicos utilizados a lo largo del sistema de estilos. |

## Dependencias relevantes
- `../types/settings` (Importa tipos del modo de tema activo para `ThemePalette`)

## Flujo de trabajo
- Los componentes y pantallas importan directamente listas (como `FREQUENCIES` o `MEDICINE_TYPES`) para poblar los selectores y modales de la interfaz de usuario.
- `AppSettingsContext.tsx` consume la función `getThemePalette` de esta carpeta al inicializarse para inyectar los colores del tema correspondiente.

## Convenciones
- Los nombres de las constantes deben ser declarados en mayúsculas sostenidas (`UPPER_SNAKE_CASE`) para denotar su inmutabilidad.
- Todas las paletas definidas en `themePalettes.ts` deben apegarse estrictamente al contrato de la interfaz `ThemePalette`.

## Restricciones
- No almacenar información dinámica o mutable de usuarios en esta carpeta.
- No alterar las claves de almacenamiento de `STORAGE_KEYS` a menos que sea una migración explícita de base de datos, para evitar la pérdida de información guardada por los usuarios.

## Relación con otras carpetas
- [types/](file:///c:/AppMedicamentos/src/types) → Requiere los tipos para estructurar correctamente las interfaces y paletas de temas.
- [context/](file:///c:/AppMedicamentos/src/context) → Abastece de paletas de colores al proveedor de configuraciones.
- [components/](file:///c:/AppMedicamentos/src/components) & [screens/](file:///c:/AppMedicamentos/src/screens) → Obtienen catálogos de opciones y presets de datos estáticos para formularios.
