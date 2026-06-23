# AGENTS.md

## Propósito
Carpeta raíz del proyecto `AppMedicamentos`, que alberga tanto la aplicación móvil en React Native (fuente principal) como un servidor API de backend para la sincronización y gestión de datos. Contiene configuraciones globales de compilación, empaquetado y arranque del sistema.

## Responsabilidades
- Configurar y registrar el punto de entrada de la aplicación móvil (`App.tsx` e `index.js`).
- Administrar el árbol de dependencias del proyecto (`package.json`, `package-lock.json`, `Gemfile`).
- Orquestar los empaquetadores de código y compiladores (`metro.config.js`, `babel.config.js`, `tsconfig.json`).
- Coordinar la interacción entre las carpetas del cliente móvil (`src/`, `android/`, `ios/`) y el servidor (`backend/`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [App.tsx](file:///c:/AppMedicamentos/App.tsx) | Punto de entrada y contenedor principal de la aplicación. Maneja el estado global de pestañas, el modal del formulario de medicamentos, la escucha de notificaciones de Notifee/alarmas nativas y el renderizado condicional de pantallas. |
| [index.js](file:///c:/AppMedicamentos/index.js) | Punto de entrada básico de React Native que registra el componente `App` mediante `AppRegistry.registerComponent`. |
| [package.json](file:///c:/AppMedicamentos/package.json) | Definición de dependencias npm, scripts de ejecución local (iOS, Android, backend) y metadatos del proyecto. |
| [metro.config.js](file:///c:/AppMedicamentos/metro.config.js) | Configuración del empaquetador Metro para la carga de recursos y bundles JavaScript. |
| [tsconfig.json](file:///c:/AppMedicamentos/tsconfig.json) | Configuración del compilador TypeScript para el proyecto React Native. |

## Dependencias relevantes
- `react-native` (Framework móvil core)
- `@notifee/react-native` (Control de notificaciones locales y alarmas)
- `react-native-safe-area-context` (Adaptación a muescas y zonas seguras de pantalla)

## Flujo de trabajo
1. `index.js` inicializa la ejecución del bundle invocando a `App.tsx`.
2. `App.tsx` envuelve la aplicación en los proveedores globales (`SafeAreaProvider`, `AppSettingsProvider`) y monta `AppShell`.
3. `AppShell` lee y reacciona a las alarmas locales al inicio, registra el controlador de eventos de Notifee e inicia un hilo periódico de verificación de notificaciones mostradas.
4. El usuario interactúa mediante el menú inferior (`BottomTabs.tsx`), alternando la pantalla activa del `AppShell` (`HomeScreen`, `MedicinesScreen`, `SchedulesScreen`, etc.).

## Convenciones
- El componente `App` de `App.tsx` debe envolverse en `SafeAreaProvider` y `AppSettingsProvider`.
- Las dependencias nativas instaladas a nivel raíz deben sincronizarse en las carpetas `android/` y `ios/` según corresponda.

## Restricciones
- No modificar el esquema de registro en `index.js` para evitar fallos de inicialización en iOS y Android.
- No alterar las versiones de dependencias críticas de React Native sin verificar la compatibilidad nativa (Gradle, CocoaPods).

## Relación con otras carpetas
- [src/](file:///c:/AppMedicamentos/src) → Contiene la arquitectura interna de lógica y presentación de la app móvil.
- [android/](file:///c:/AppMedicamentos/android) → Contiene el proyecto de compilación Android y módulos Kotlin personalizados.
- [ios/](file:///c:/AppMedicamentos/ios) → Contiene el proyecto de compilación iOS y configuración de pods Xcode.
- [backend/](file:///c:/AppMedicamentos/backend) → API REST Node/Express para el consumo de datos de medicamentos.
