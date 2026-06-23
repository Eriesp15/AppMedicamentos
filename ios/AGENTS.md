# AGENTS.md

## Propósito
Directorio que alberga el código nativo de la plataforma iOS, configuración de CocoaPods y metadatos del proyecto Xcode necesarios para compilar y ejecutar la aplicación móvil en dispositivos Apple.

## Responsabilidades
- Iniciar la ejecución de la aplicación móvil React Native en dispositivos iOS a través del ciclo de vida nativo de UIKit.
- Configurar dependencias nativas de iOS mediante CocoaPods (`Podfile`).
- Gestionar permisos del sistema iOS (notificaciones, audio, segundo plano) descritos en el archivo `Info.plist`.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [AppDelegate.swift](file:///c:/AppMedicamentos/ios/AppMedicamentos/AppDelegate.swift) | Clase principal de la aplicación iOS. Inicializa el delegado de React Native (`ReactNativeDelegate`), configura el proveedor de dependencias nativas e inicializa la ventana del sistema. |
| [Podfile](file:///c:/AppMedicamentos/ios/Podfile) | Archivo de configuración de CocoaPods que descarga, compila y enlaza las dependencias nativas (ej. Notifee, AsyncStorage, Firebase) con el binario de iOS. |
| [Info.plist](file:///c:/AppMedicamentos/ios/AppMedicamentos/Info.plist) | Lista de propiedades del proyecto. Define el nombre mostrado de la app, fuentes personalizadas y solicitudes de permisos para notificaciones locales. |

## Dependencias relevantes
- CocoaPods (Gestor de dependencias de Objective-C y Swift)
- UIKit (Framework de interfaces nativas de iOS)
- `@notifee/react-native` (Utiliza la API UNUserNotificationCenter de iOS para agendar notificaciones locales)

## Flujo de trabajo
1. El sistema operativo iOS carga el ejecutable y llama a `application(_:didFinishLaunchingWithOptions:)` en `AppDelegate.swift`.
2. El delegado crea la instancia de `RCTReactNativeFactory` y arranca la máquina virtual de React Native cargando el bundle `index.js`.
3. Notifee (integrado a nivel nativo de iOS) se encarga de interceptar y pintar las alertas locales agendadas, ya que en iOS no se pueden lanzar pantallas completas interactivas personalizadas en background como en Android.

## Convenciones
- Toda configuración de CocoaPods debe actualizarse mediante la ejecución de `pod install` desde la consola de macOS dentro de la carpeta `ios/`.
- Las variables de diseño o muescas de pantalla se resuelven del lado de React Native mediante Safe Area Provider.

## Restricciones
- No utilizar ni definir puentes nativos personalizados para alarmas en iOS (`AlarmLaunchModule`), dado que iOS restringe severamente la ejecución de tareas de sistema que irrumpan en pantalla, debiendo gestionarse todo mediante el sistema estándar de notificaciones locales de Apple.

## Relación con otras carpetas
- [services/](file:///c:/AppMedicamentos/src/services) → Consume la API estándar de notificaciones de Notifee (que internamente hace puente con `UNUserNotificationCenter` de iOS) omitiendo el módulo nativo de alarmas exclusivo de Android.
- [App.tsx (Raíz)](file:///c:/AppMedicamentos/App.tsx) → Punto de entrada JavaScript cargado por la factoría de React Native inicializada en `AppDelegate.swift`.
