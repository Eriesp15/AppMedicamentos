# AGENTS.md

## Propósito
Directorio que contiene el código fuente nativo de Android, archivos de configuración Gradle y manifiestos de compilación para la plataforma Android. Alberga el puente nativo Kotlin para habilitar alarmas de sistema altamente precisas que superan los bloqueos de segundo plano de Android.

## Responsabilidades
- Compilar la aplicación móvil para dispositivos Android empleando el sistema Gradle.
- Gestionar configuraciones de permisos en el archivo `AndroidManifest.xml` (ej. alarma exacta, ventanas superpuestas, ignorar optimización de batería).
- Implementar el puente nativo Kotlin (`AlarmLaunchModule`) para invocar servicios del sistema Android desde JavaScript/TypeScript.
- Controlar los receptores de difusión (`AlarmReceiver`) y actividades de pantalla completa (`AlarmActivity`) que interceptan las alertas físicas cuando el teléfono está bloqueado o en reposo.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [AlarmLaunchModule.kt](file:///c:/AppMedicamentos/android/app/src/main/java/com/appmedicamentos/AlarmLaunchModule.kt) | Módulo nativo React Native en Kotlin. Expone APIs nativas para programar alarmas exactas en el `AlarmManager`, verificar y solicitar permisos de superposición (`SYSTEM_ALERT_WINDOW`), y omitir optimizaciones de batería. |
| [AlarmReceiver.kt](file:///c:/AppMedicamentos/android/app/src/main/java/com/appmedicamentos/AlarmReceiver.kt) | Escucha los disparos del `AlarmManager`, despierta el dispositivo mediante un candado de vigilia (`WakeLock`) y lanza la notificación o pantalla completa de alarma (`AlarmActivity`). |
| [AlarmActivity.kt](file:///c:/AppMedicamentos/android/app/src/main/java/com/appmedicamentos/AlarmActivity.kt) | Actividad Kotlin personalizada para mostrar alarmas sobre la pantalla de bloqueo. Pasa parámetros del medicamento a React Native en el arranque de la app. |
| [build.gradle](file:///c:/AppMedicamentos/android/app/build.gradle) | Script Gradle que define la versión de compilación de Android SDK, dependencias Gradle y configuraciones de firmas. |
| [AndroidManifest.xml](file:///c:/AppMedicamentos/android/app/src/main/AndroidManifest.xml) | Manifiesto de Android que registra actividades, receptores, servicios nativos y permisos de hardware del dispositivo. |

## Dependencias relevantes
- Gradle (Sistema de automatización de compilación)
- Android SDK (Librerías del sistema operativo Android)
- `@notifee/react-native` (Vinculación de notificaciones a nivel nativo de Android)

## Flujo de trabajo
1. React Native llama a `scheduleAlarm` de `AlarmLaunchModule.kt` enviando un timestamp.
2. El módulo nativo calcula un `PendingIntent` y lo agenda en el `AlarmManager` del dispositivo de manera exacta.
3. Al cumplirse el tiempo, Android despierta `AlarmReceiver.kt`.
4. El receptor adquiere un `WakeLock` temporal, inicia un canal de alarma y lanza `AlarmActivity.kt` de forma interactiva (incluso en pantalla de bloqueo).
5. La actividad monta el bundle de React Native, inyecta las propiedades del medicamento y muestra la superposición al usuario.

## Convenciones
- El código nativo en Kotlin reside en `android/app/src/main/java/com/appmedicamentos/`.
- Cualquier permiso añadido al manifiesto debe validarse en tiempo de ejecución en el código Kotlin y TypeScript.

## Restricciones
- No actualizar el SDK objetivo (`targetSdkVersion` o `compileSdkVersion`) en `build.gradle` sin antes comprobar la compatibilidad de permisos de alarmas exactas introducidos en versiones recientes de Android (Android 12, 13 y 14).
- Las llamadas a `AlarmManager` deben utilizar los métodos correspondientes para alarmas exactas e inexactas dependiendo de las políticas de Google Play.

## Relación con otras carpetas
- [services/](file:///c:/AppMedicamentos/src/services) → Expone las llamadas nativas de Kotlin mediante la fachada `AlarmLaunchNative.ts` en TypeScript.
- [App.tsx (Raíz)](file:///c:/AppMedicamentos/App.tsx) → Consume los datos inyectados por `AlarmActivity.kt` para abrir directamente la interfaz de alarma activa.
