# AGENTS.md

## Propósito
Alojar funciones utilitarias puras y auxiliares que no manejan estado propio, destinadas a realizar formateo de datos de fecha, validación de inputs y sanitización de textos ingresados por el usuario.

## Responsabilidades
- Formatear fechas del sistema a representaciones textuales localizadas en español (`formatDateLabel`).
- Sanitizar cadenas de texto ingresadas en formularios móviles utilizando expresiones regulares para evitar caracteres extraños o maliciosos.
- Validar y formatear números decimales, enteros y de teléfono.
- Normalizar entradas horarias y proveer partes de tiempo (horas/minutos) de manera segura (`normalizeTime`, `getTimeParts`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [inputSanitizers.ts](file:///c:/AppMedicamentos/src/utils/inputSanitizers.ts) | Filtros de expresiones regulares para nombres de medicamentos, nombres de personas, notas clínicas, tipos de sangre, teléfonos y horas del día. |
| [date.ts](file:///c:/AppMedicamentos/src/utils/date.ts) | Formatea objetos Date al idioma local español (ej. "lunes, 23 de jun"). |

## Dependencias relevantes
- No posee dependencias externas; contiene únicamente funciones de procesamiento de datos puros.

## Flujo de trabajo
- Los componentes que capturan datos del usuario (como `MedicineFormModal.tsx` o `ProfileScreen.tsx`) interceptan el evento de cambio de texto en los inputs e invocan a las funciones sanitizadoras de esta carpeta antes de actualizar el estado del formulario.
- Los servicios de alarma consultan a `getTimeParts` para descomponer la hora inicial de los tratamientos al calcular disparadores de Notifee.

## Convenciones
- Todas las funciones de utilidad deben ser puras (no deben tener efectos secundarios en variables globales o estado externo).
- Deben incluir tipado explícito de entrada y retorno en TypeScript.

## Restricciones
- No incluir llamadas de red (fetch, axios) o persistencia (AsyncStorage) dentro de estas utilidades.
- No depender de variables de entorno o configuraciones del sistema operativo.

## Relación con otras carpetas
- [components/](file:///c:/AppMedicamentos/src/components) → Consume sanitizadores en inputs de formularios.
- [screens/](file:///c:/AppMedicamentos/src/screens) → Utiliza el formateador de fechas para pintar bitácoras históricas e inputs de perfil.
- [services/](file:///c:/AppMedicamentos/src/services) → Emplea normalizadores de horas para estructurar disparadores del sistema de alarmas.
