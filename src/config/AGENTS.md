# AGENTS.md

## Propósito
Alojar las configuraciones e inicializaciones de servicios e infraestructuras externas de la aplicación, como la base de datos remota de Firebase Firestore.

## Responsabilidades
- Cargar e inicializar la aplicación cliente de Firebase utilizando las credenciales provistas.
- Instanciar y exportar la referencia del cliente de base de datos Firestore (`firestoreDb`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [firebase.ts](file:///c:/AppMedicamentos/src/config/firebase.ts) | Inicializa la conexión con la base de datos NoSQL de Firebase. Exporta la variable `firestoreDb` que interactúa con la persistencia en la nube. |

## Dependencias relevantes
- `firebase/app` (Inicialización de Firebase core)
- `firebase/firestore` (Acceso al almacén NoSQL Cloud Firestore)

## Flujo de trabajo
- Al cargarse el bundle del proyecto, se importa `firebase.ts` en la capa de almacenamiento (`storage/medicationStorage.ts`). Esto inicia la conexión en segundo plano con Firebase para permitir el flujo de sincronización en tiempo real.

## Convenciones
- Mantener las llaves de configuración de Firebase en este archivo o en variables de entorno seguras.
- Solo exportar instancias listas para su uso directo (ej. `firestoreDb`), delegando la lógica de consulta y suscripción a la capa de servicios o storage.

## Restricciones
- No inicializar múltiples instancias de Firebase App para evitar errores de duplicidad en tiempo de ejecución.
- Asegurarse de que el SDK de Firebase esté correctamente vinculado en las plataformas nativas.

## Relación con otras carpetas
- [storage/](file:///c:/AppMedicamentos/src/storage) → Consume la referencia de `firestoreDb` de esta carpeta para realizar lecturas y escrituras en la nube.
