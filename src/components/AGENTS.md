# AGENTS.md

## Propósito
Contener componentes visuales de interfaz de usuario (UI) que son altamente interactivos y reutilizados a lo largo de las distintas pantallas de la aplicación.

## Responsabilidades
- Proporcionar elementos visuales atómicos (iconos, botones) y moleculares (autocomplete, pestañas de navegación).
- Controlar estados locales e interfaces de captura de datos complejas (como el modal de creación y edición de medicamentos).
- Respetar los estilos visuales provistos dinámicamente por el contexto de accesibilidad y temas de la app.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [MedicineFormModal.tsx](file:///c:/AppMedicamentos/src/components/MedicineFormModal.tsx) | Modal interactivo para dar de alta o editar un medicamento. Controla validaciones de dosis, días, selección de sonidos de alarma, preescucha del tono de alarma, frecuencias horarias y sincroniza con el catálogo autocompletable. |
| [MedicationAutocomplete.tsx](file:///c:/AppMedicamentos/src/components/MedicationAutocomplete.tsx) | Entrada de texto predictiva que filtra sugerencias de nombres de medicamentos y rellena automáticamente campos predefinidos. |
| [BottomTabs.tsx](file:///c:/AppMedicamentos/src/components/BottomTabs.tsx) | Barra de navegación inferior que renderiza los botones para cambiar entre las secciones principales (`home`, `medicines`, `add`, `schedules`, `tracking`). |
| [AppIcon.tsx](file:///c:/AppMedicamentos/src/components/AppIcon.tsx) | Envoltorio para unificar el uso de iconos vectoriales a través de `@fortawesome/react-native-fontawesome`. |
| [SettingsHeaderButton.tsx](file:///c:/AppMedicamentos/src/components/SettingsHeaderButton.tsx) | Botón circular del encabezado que permite invocar la configuración global de la aplicación. |

## Dependencias relevantes
- `@fortawesome/react-native-fontawesome` & `@fortawesome/free-solid-svg-icons` (Iconografía de la aplicación)
- `./MedicationAutocomplete` (Utilizado por `MedicineFormModal`)
- `../utils/inputSanitizers` (Sanitización y normalización de textos, horas y números en caliente)
- `../services/alarmService` (Método `playAlarmPreview` para reproducir tonos antes de guardarlos)

## Flujo de trabajo
1. `BottomTabs.tsx` emite eventos `onPress` hacia `App.tsx` para cambiar la pestaña activa de la aplicación.
2. `MedicineFormModal.tsx` recibe el estado actual del formulario (`form` de tipo `MedicineForm`) e interactúa con el usuario. Si se presiona guardar, sanitiza los datos ingresados y ejecuta `onSave`.
3. `MedicationAutocomplete.tsx` busca sobre un catálogo provisto e invoca `onSelectSuggestion` para precompletar el formulario en `MedicineFormModal.tsx`.

## Convenciones
- Todos los componentes deben consumir estilos generados dinámicamente mediante `useAppSettings()` para reaccionar a cambios en el tamaño de fuente, contraste y temas (Light/Dark).
- Los inputs numéricos de dosis o días deben pasar por `sanitizeDecimal` o `sanitizeDigits` respectivamente, antes de guardarse en el estado local.

## Restricciones
- No utilizar estilos estáticos hardcodeados; depender siempre del hook `useAppSettings` y su paleta de colores/estilos dinámicos.
- La previsualización de alarmas de `MedicineFormModal.tsx` debe ser detenida o silenciada al cerrar el modal.

## Relación con otras carpetas
- [context/](file:///c:/AppMedicamentos/src/context) → Consume el `AppSettingsContext` para la adaptabilidad visual (tema oscuro, botones más grandes para accesibilidad, etc.).
- [utils/](file:///c:/AppMedicamentos/src/utils) → Utiliza `inputSanitizers.ts` para validar textos y campos numéricos.
- [screens/](file:///c:/AppMedicamentos/src/screens) → Los componentes son embebidos dentro de las pantallas para estructurar las interfaces.
