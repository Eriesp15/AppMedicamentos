# AGENTS.md

## Propósito
Alojar las pantallas o vistas de pantalla completa de la aplicación. Representan los contenedores lógicos que integran los componentes reutilizables, aplican estilos locales y consumen los datos del gestor de estado.

## Responsabilidades
- Renderizar las interfaces principales de cada módulo de la aplicación (Inicio, Medicamentos, Alarmas, Configuración, etc.).
- Vincular las interacciones de los usuarios con las funciones del hook de negocio (`useMedicationManager`).
- Organizar el maquetado visual estructural de la app utilizando ScrollViews, áreas seguras y tarjetas de información.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [HomeScreen.tsx](file:///c:/AppMedicamentos/src/screens/HomeScreen.tsx) | Pantalla de inicio con un anillo de progreso de adherencia del día, contadores de dosis y la lista interactiva de medicamentos del día para marcar como tomados u omitidos. |
| [MedicinesScreen.tsx](file:///c:/AppMedicamentos/src/screens/MedicinesScreen.tsx) | Muestra el catálogo de medicamentos del usuario y proporciona opciones para editarlos o eliminarlos. |
| [AddMedicineScreen.tsx](file:///c:/AppMedicamentos/src/screens/AddMedicineScreen.tsx) | Vista simplificada orientada a registrar nuevos medicamentos sirviéndose del catálogo autocompletable. |
| [SchedulesScreen.tsx](file:///c:/AppMedicamentos/src/screens/SchedulesScreen.tsx) | Pantalla de cronogramas que expone los horarios configurados de toma de medicamentos y permite activar/desactivar alarmas individuales. |
| [TrackingScreen.tsx](file:///c:/AppMedicamentos/src/screens/TrackingScreen.tsx) | Módulo de seguimiento estadístico. Presenta gráficos de adherencia semanal y la bitácora completa del historial de tomas realizadas. |
| [AlarmScreen.tsx](file:///c:/AppMedicamentos/src/screens/AlarmScreen.tsx) | Superposición a pantalla completa que se dispara al activarse una alarma nativa. Contiene alertas sonoras y visuales críticas de toma de medicamento, con botones para "Posponer" o "Marcar como Tomado". |
| [SettingsScreen.tsx](file:///c:/AppMedicamentos/src/screens/SettingsScreen.tsx) | Panel de configuración de accesibilidad. Controla el tema visual (Claro, Oscuro, Contraste Alto), tamaño de letra, volumen, vibración y permisos nativos del sistema. |
| [ProfileScreen.tsx](file:///c:/AppMedicamentos/src/screens/ProfileScreen.tsx) | Formulario de información de salud del paciente (nombre, tipo de sangre, alergias, enfermedades crónicas y contactos de emergencia). |
| [HistoryScreen.tsx](file:///c:/AppMedicamentos/src/screens/HistoryScreen.tsx) | Pantalla complementaria para consultar el registro histórico de tomas por fecha específica. |
| [TipsScreen.tsx](file:///c:/AppMedicamentos/src/screens/TipsScreen.tsx) | Tarjetas con recomendaciones de salud y mejores prácticas para el seguimiento correcto de tratamientos. |

## Dependencias relevantes
- `@fortawesome/react-native-fontawesome` (Visualización de iconos temáticos)
- `../components/` (Inclusión de modales, autocompletados y barras inferiores)
- `../context/AppSettingsContext` (Consulta y actualización de temas, accesibilidad y fuentes)
- `../services/AlarmLaunchNative` (Consulta y redirección de permisos especiales de alarma)

## Flujo de trabajo
- `AppShell` (`App.tsx`) controla el renderizado de la pantalla activa mediante el mapeo del tab seleccionado.
- Al interactuar en una pantalla (ej. tocar "Tomar" en `HomeScreen`), se invoca una función callback del hook `useMedicationManager`, lo que actualiza el estado y hace que las pantallas se re-rendericen con los datos modificados.
- Al sonar una alarma física en el celular en primer plano o segundo plano, la aplicación superpone a nivel global la pantalla `AlarmScreen.tsx` interrumpiendo el flujo del usuario.

## Convenciones
- El diseño debe ser responsivo y amigable para el adulto mayor o personas con debilidad visual. Se deben usar contenedores amplios y respetar el indicador `largeTouchTargets` para ensanchar los botones.
- Cada pantalla debe consultar de manera proactiva los estilos dinámicos de `createAppStyles` para una correcta adaptación de colores.

## Restricciones
- No manejar persistencia directamente en las pantallas; llamar siempre a las funciones expuestas en el contexto de negocio o almacenamiento.
- `AlarmScreen.tsx` debe ser lo más ligera y aislada posible para responder instantáneamente en sistemas lentos.

## Relación con otras carpetas
- [components/](file:///c:/AppMedicamentos/src/components) → Incorpora los elementos reutilizables de entrada y visualización.
- [context/](file:///c:/AppMedicamentos/src/context) → Utiliza el estado visual global para las configuraciones y estilos de accesibilidad.
- [hooks/](file:///c:/AppMedicamentos/src/hooks) → Obtiene los datos del tratamiento del usuario y el historial.
