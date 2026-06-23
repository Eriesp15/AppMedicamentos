# AGENTS.md

## Propósito
Centralizar las declaraciones de tipos de TypeScript e interfaces del proyecto móvil, asegurando que todos los componentes, hooks, servicios y bases de datos compartan los mismos contratos de datos.

## Responsabilidades
- Definir el esquema y campos tipados del modelo de medicamento (`Medicine`).
- Declarar el contrato para los registros del historial de tomas (`ActivityItem`).
- Tipar los campos del formulario de creación y perfil de usuario (`MedicineForm`, `UserProfile`).
- Definir el esquema de configuraciones globales y de accesibilidad de la aplicación (`AppSettings`).

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [medication.ts](file:///c:/AppMedicamentos/src/types/medication.ts) | Estructuras de datos relativas al negocio de toma de medicamentos: tipo de pestaña activa (`AppTab`), esquema del medicamento, log de actividades diarias, formulario y perfil del paciente. |
| [settings.ts](file:///c:/AppMedicamentos/src/types/settings.ts) | Modelos de configuración y accesibilidad de la app: presets de fuentes (`normal`, `large`, `xlarge`), modos de temas (`light`, `dark`, `highContrast`), volumen y valores por defecto del sistema (`DEFAULT_APP_SETTINGS`). |

## Dependencias relevantes
- No posee dependencias externas; contiene únicamente definiciones puras de TypeScript.

## Flujo de trabajo
- Este directorio provee las plantillas de tipo a todo el resto del código fuente. Cuando se crean estados React (por ejemplo en `useMedicationManager`), se declaran usando genéricos tipo `useState<Medicine[]>([])` apoyándose en las interfaces declaradas en esta carpeta.

## Convenciones
- Los tipos y propiedades deben nombrarse usando notación de camello (`camelCase`).
- Usar uniones de literales (`union types`) para campos con valores cerrados y predecibles (ej. tipo de tema `'light' | 'dark' | 'highContrast'`).

## Restricciones
- No colocar lógica de ejecución, variables o funciones dentro de esta carpeta; se reserva exclusivamente para tipos estáticos (`type`, `interface`, `enum`).
- Las modificaciones a las interfaces aquí descritas deben ser evaluadas con cautela, ya que pueden ocasionar roturas en cascada a lo largo de componentes, base de datos local y Firebase Firestore.

## Relación con otras carpetas
- [storage/](file:///c:/AppMedicamentos/src/storage) → Mapea las interfaces de medicamentos y logs de actividad al serializar y deserializar datos.
- [hooks/](file:///c:/AppMedicamentos/src/hooks) → Utiliza los tipos para controlar los estados del negocio.
- [components/](file:///c:/AppMedicamentos/src/components) & [screens/](file:///c:/AppMedicamentos/src/screens) → Utilizan las firmas tipadas para definir las propiedades (`props`) de entrada y salida de datos.
