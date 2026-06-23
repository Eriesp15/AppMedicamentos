# AGENTS.md

## Propósito
Administrar la persistencia de datos local y remota de la aplicación. Maneja el almacenamiento offline rápido en el almacenamiento del dispositivo y la sincronización bidireccional en tiempo real con la base de datos Firebase Firestore.

## Responsabilidades
- Guardar, leer y eliminar datos del usuario, medicamentos y logs de adherencia en el almacenamiento local (`AsyncStorage`).
- Escuchar actualizaciones en la nube a través de sockets web (`onSnapshot` de Firestore) para reflejar cambios remotos instantáneamente.
- Resolver conflictos de mezcla entre actualizaciones remotas y modificaciones offline locales.
- Normalizar registros al extraerlos para asegurar compatibilidad de datos antiguos con nuevas versiones del esquema de la base de datos.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [medicationStorage.ts](file:///c:/AppMedicamentos/src/storage/medicationStorage.ts) | Adaptador principal de almacenamiento. Centraliza las operaciones de lectura/escritura en `AsyncStorage`, las suscripciones nativas a colecciones Firestore y las rutinas de mezcla (`mergeRemoteActivity`). |

## Dependencias relevantes
- `@react-native-async-storage/async-storage` (Caché local rápido y persistencia fuera de línea)
- `firebase/firestore` (Suscripciones web reactivas e inserciones en tiempo real)
- `../config/firebase` (Instancia configurada de base de datos Firestore)
- `../constants/data` (Las constantes de llaves de guardado `STORAGE_KEYS`)

## Flujo de trabajo
1. Al arrancar la aplicación, `useMedicationManager` carga los datos almacenados localmente de inmediato invocando a `loadPersistedData`.
2. Al mismo tiempo, `medicationStorage` establece escuchadores en la nube mediante `subscribeToMedicines` y `subscribeToActivity`.
3. Cuando Firebase notifica cambios en red:
   - Se leen las medicinas locales actuales y se mezclan con los registros remotos.
   - Se descartan elementos marcados para borrado inminente (`pendingDeleteIds`).
   - Se sobrescribe el caché local de `AsyncStorage` y se actualiza el estado React de la aplicación para repintar la UI.
4. Al crear, modificar o eliminar datos desde la app móvil, se escribe en local y se dispara una escritura asincrónica en Firestore (`persistMedicines`, `deleteMedicinesFromFirestore`).

## Convenciones
- Toda información extraída de almacenamiento debe pasar por la función `normalizeMedicine` para asegurar que los campos opcionales o añadidos recientemente posean un valor por defecto seguro.
- Las consultas a Firestore deben estructurarse de forma ordenada (`orderBy`) utilizando índices lógicos (ej. ordenar por fecha o fecha de creación).

## Restricciones
- No bloquear el hilo principal de renderizado con lecturas/escrituras sincrónicas pesadas; todas las operaciones expuestas deben ser promesas asíncronas (`async/await`).
- Evitar bucles infinitos de sincronización donde una lectura de Firestore dispare una escritura hacia Firestore.

## Relación con otras carpetas
- [config/](file:///c:/AppMedicamentos/src/config) → Obtiene la referencia de conexión de base de datos activa `firestoreDb`.
- [types/](file:///c:/AppMedicamentos/src/types) → Requiere los esquemas de tipos de TypeScript para la validación y tipado estático de los retornos de datos.
- [hooks/](file:///c:/AppMedicamentos/src/hooks) → Es invocado directamente por `useMedicationManager` para canalizar las operaciones del estado de negocio.
