# AGENTS.md

## Propósito
Centralizar la lógica de negocio, flujos de estado de datos de medicamentos, el historial de tomas, perfiles de usuario e interacciones con las capas de base de datos local y remota.

## Responsabilidades
- Sincronizar el estado en memoria de la aplicación con el almacenamiento persistente (`AsyncStorage` y `Firebase Firestore`).
- Gestionar el ciclo de vida del formulario de medicamentos (creación, edición, guardado, borrado).
- Calcular métricas de adherencia en tiempo real (porcentaje de toma, dosis pendientes del día, dosis omitidas).
- Coordinar la actualización y reprogramación de alarmas locales al modificar el estado de algún medicamento.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [useMedicationManager.ts](file:///c:/AppMedicamentos/src/hooks/useMedicationManager.ts) | Hook principal de lógica de negocio. Orquesta la obtención de datos remotos y locales, el control de la pestaña activa, las llamadas de guardado/edición de medicamentos y el registro de adherencia diaria. |

## Dependencias relevantes
- `../storage/medicationStorage` (Funciones de base de datos: lecturas, escrituras y suscripciones en vivo)
- `../services/alarmService` (Programación y cancelación de alarmas y notificaciones)
- `../utils/inputSanitizers` (Sanitización y normalización de textos y números del formulario)
- `../types/medication` (Estructuras de datos de Medicamento, Perfil y Actividad)

## Flujo de trabajo
1. Al invocar el hook, se leen los datos iniciales desde el almacenamiento persistente mediante `loadPersistedData`.
2. Se establecen escuchadores en tiempo real (`subscribeToMedicines`, `subscribeToActivity`, `subscribeToMedicationCatalog`) para captar cambios de Firebase y mezclarlos con el caché local.
3. Cuando el usuario guarda un medicamento a través del formulario:
   - Se validan y formatean los campos con `inputSanitizers`.
   - Se actualiza la base de datos persistente.
   - Se recalculan y programan las alarmas físicas en el dispositivo a través de `scheduleAllMedicineAlarms`.
4. Si el usuario marca un medicamento como "Tomado" u "Omitido", se genera un elemento de historial (`ActivityItem`) y se recalcula el porcentaje de adherencia global.

## Convenciones
- Toda manipulación directa del estado de medicamentos (`medicines`), logs de actividad (`activity`) y perfil (`profile`) debe fluir a través de los métodos expuestos por este hook.
- Al eliminar un elemento, se debe registrar su ID en una cola temporal (`pendingDeleteIds`) para evitar conflictos de sobreescritura al sincronizar con actualizaciones remotas de red.

## Restricciones
- No llamar a la reprogramación de alarmas sin antes asegurar que el almacenamiento local se haya persistido de forma exitosa.
- Mantener la lógica de cálculo de adherencia puramente sincrónica usando variables memoizadas (`useMemo`) para evitar bloqueos del hilo principal.

## Relación con otras carpetas
- [storage/](file:///c:/AppMedicamentos/src/storage) → Intercambia datos con los adaptadores de almacenamiento AsyncStorage y Firebase.
- [services/](file:///c:/AppMedicamentos/src/services) → Dispara la calendarización y cancelación de notificaciones físicas.
- [screens/](file:///c:/AppMedicamentos/src/screens) → Abastece a las pantallas principales del estado necesario para pintar la UI.
