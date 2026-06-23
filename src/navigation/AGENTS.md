# AGENTS.md

## Propósito
Directorio reservado para la configuración de enrutamiento y navegación formal entre pantallas (por ejemplo, React Navigation o Expo Router). Actualmente actúa como un marcador de posición, ya que la navegación se maneja por pestañas de forma condicional desde el estado del shell de la aplicación (`App.tsx`).

## Responsabilidades
- Servir como punto de integración futuro en caso de implementar navegadores avanzados (Stack Navigator, Drawer Navigator o Tab Navigator).
- Mantener la limpieza estructural de la aplicación React Native.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [.gitkeep](file:///c:/AppMedicamentos/src/navigation/.gitkeep) | Archivo vacío utilizado para forzar la inclusión de este directorio vacío en el control de versiones Git. |

## Dependencias relevantes
- No posee dependencias activas en el estado actual.

## Flujo de trabajo
- En la arquitectura actual, la navegación se realiza de manera declarativa en `App.tsx`. El componente `BottomTabs.tsx` actualiza el estado `activeTab` del gestor de medicamentos (`useMedicationManager`), y `App.tsx` renderiza condicionalmente la pantalla correspondiente (`HomeScreen`, `MedicinesScreen`, etc.).

## Convenciones
- Si se decide migrar a una biblioteca de navegación como `@react-navigation/native`, las definiciones de rutas, navegadores de pestañas y tipado de navegación (`RootStackParamList`) deben ser alojados en este directorio.

## Restricciones
- No colocar lógica de negocio o componentes visuales dentro de esta carpeta; está reservada estrictamente para la infraestructura de enrutamiento.

## Relación con otras carpetas
- [App.tsx (Raíz)](file:///c:/AppMedicamentos/App.tsx) → Orquesta el flujo de navegación real por medio de renderizado condicional de componentes.
- [screens/](file:///c:/AppMedicamentos/src/screens) → Destino de las transiciones y pantallas de la aplicación.
