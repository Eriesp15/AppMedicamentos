## Guía Rápida de Inicio - MediCare

### Pasos para Ejecutar en Android Studio

1. **Abre el proyecto en Android Studio:**
   - Abre Android Studio
   - Selecciona "Open" y navega a la carpeta `android/` del proyecto

2. **Instala las dependencias del proyecto:**
   ```bash
   cd /vercel/share/v0-project
   npm install
   # o si usas pnpm
   pnpm install
   ```

3. **Inicia el servidor de Metro (en una terminal):**
   ```bash
   npm start
   # o
   react-native start
   ```

4. **En otra terminal, compila para Android:**
   ```bash
   npm run android
   # o
   react-native run-android
   ```

5. **El emulador debería ejecutar la aplicación automáticamente**

### Características que Puedes Probar

**En Inicio:**
- Ver medicamentos del día actual
- Marcar medicamentos como tomados
- Navegar a "Agregar Medicamento" o "Ver Historial"

**En Medicamentos:**
- Presiona el botón "+" para agregar un nuevo medicamento
- Rellena el formulario completo
- Agrega múltiples horarios de toma
- Selecciona un color
- Presiona "Guardar"

**En Horarios:**
- Selecciona diferentes fechas
- Ve el historial de medicamentos
- Observa las estadísticas (tomados, pendientes, total)

**En Perfil:**
- Presiona "Editar"
- Completa tu información personal
- Agrega información médica y de emergencia
- Presiona "Guardar"

### Datos de Prueba Incluidos

La aplicación viene con 3 medicamentos de prueba:
- Aspirina 100mg a las 08:00
- Metformina 500mg a las 12:00
- Losartán 50mg a las 20:00

Puedes eliminarlos y agregar los tuyos.

### Solución Rápida de Problemas

**Problema: "Cannot find module"**
```bash
npm install
# o limpiar cache
npm start --reset-cache
```

**Problema: Emulador no inicia**
- Abre el Emulator Manager en Android Studio
- Crea o inicia un dispositivo virtual
- Intenta correr nuevamente

**Problema: La aplicación se cierra**
- Revisa la consola de Metro para errores
- Limpia el caché: `npm start --reset-cache`
- Reinstala: `npm install`

### Estructura Principal

- **Inicio**: Medicamentos de hoy con estado
- **Medicamentos**: CRUD completo de medicamentos
- **Horarios**: Vista histórica y calendario
- **Perfil**: Información del usuario

### Tips de Desarrollo

- Los datos se guardan automáticamente en AsyncStorage
- Puedes cambiar colores en `src/utils/theme.ts`
- Los tipos TypeScript están en `src/types/index.ts`
- Nuevas pantallas van en `src/screens/`
- Componentes reutilizables en `src/components/`

### Versión

MediCare Frontend v1.0.0 - Marzo 2026

¡Disfruta de la aplicación! 🎉
