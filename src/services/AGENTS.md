# AGENTS.md

## Propósito
Proporcionar abstracciones e interfaces para interactuar con APIs externas y con las capacidades nativas del hardware y sistema operativo (especialmente el sistema de notificaciones del dispositivo y la alarma nativa).

## Responsabilidades
- Establecer comunicación con las API REST de sincronización de datos (`api.ts`).
- Gestionar permisos del sistema para notificaciones y alertas críticas en Android e iOS.
- Programar, reprogramar, posponer (snooze) y cancelar alarmas a nivel de sistema operativo utilizando `@notifee/react-native` y llamadas Kotlin nativas.
- Traducir esquemas de tratamiento médico (frecuencia cada 8 horas, 12 horas, etc.) a marcas de tiempo (`timestamps`) exactas requeridas por los desencadenadores de alarmas físicas.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [alarmService.ts](file:///c:/AppMedicamentos/src/services/alarmService.ts) | Coordina la lógica de Notifee para construir canales de audio, programar disparadores repetitivos (`TimestampTrigger`) y procesar eventos en segundo y primer plano cuando suena una alerta. |
| [AlarmLaunchNative.ts](file:///c:/AppMedicamentos/src/services/AlarmLaunchNative.ts) | Puente de React Native que expone los métodos expuestos por el módulo nativo Kotlin `AlarmLaunchModule` para saltar bloqueos de batería, permisos de pantalla de bloqueo y alarmas exactas en Android. |
| [api.ts](file:///c:/AppMedicamentos/src/services/api.ts) | Cliente Axios configurado para conectarse con el servidor de backend (usando `10.0.2.2` en emuladores de Android). |

## Dependencias relevantes
- `@notifee/react-native` (Motor de notificaciones y disparadores locales)
- `react-native` (Clase `NativeModules` para el puente nativo con Kotlin/Swift)
- `axios` (Librería cliente HTTP)

## Flujo de trabajo
1. Cuando se guarda o modifica un medicamento, `useMedicationManager` llama a `scheduleAllMedicineAlarms`.
2. `alarmService.ts` calcula las próximas 3 ocurrencias basadas en la frecuencia horaria (e.g., desplazamientos de 8 o 12 horas desde `startTime`).
3. Para cada toma proyectada, se registra un `TimestampTrigger` en Notifee y, en paralelo, se invoca `scheduleAlarmLaunch` de `AlarmLaunchNative.ts` para agendar la alarma nativa exacta en el sistema de Android.
4. Cuando se activa la alerta en el celular, el manejador de notificaciones despierta la aplicación y muestra la superposición `AlarmScreen`.

## Convenciones
- Los canales de notificación en Android creados por Notifee deben configurarse con importancia máxima (`AndroidImportance.HIGH`) y categoría de alarma (`AndroidCategory.ALARM`) para asegurar que suenen en modo No Molestar.
- Los módulos de `AlarmLaunchNative.ts` deben incorporar verificaciones preventivas de plataforma (`Platform.OS === 'android'`) para evitar excepciones en dispositivos iOS.

## Restricciones
- No utilizar temporizadores JavaScript en memoria (`setTimeout`) para agendar alarmas, ya que el sistema operativo mata los procesos en background; usar siempre `Notifee` o el puente nativo de Android.
- No alterar la configuración de los canales de Notifee una vez creados, ya que Android bloquea los cambios a nivel de canal tras el primer montaje a menos que se reinstale la app.

## Relación con otras carpetas
- [android/](file:///c:/AppMedicamentos/android) → Depende de la implementación Kotlin del archivo `AlarmLaunchModule.kt` para los métodos de `AlarmLaunchNative.ts`.
- [hooks/](file:///c:/AppMedicamentos/src/hooks) → Provee las funciones de programación automática al gestor de medicamentos.
- [constants/](file:///c:/AppMedicamentos/src/constants) → Consume la constante `ALARM_SOUND_OPTIONS` para mapear los recursos de audio físicos.
