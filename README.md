# MediCare - App de Gestión de Medicamentos

Una aplicación móvil de React Native diseñada para ayudar a los usuarios a controlar la ingesta de medicamentos, registrar historiales y recibir consejos de salud.

## 📋 Características

- **Pantalla de Inicio**: Vista general del día con medicamentos pendientes y adherencia
- **Agregar Medicamentos**: Formulario completo para registrar nuevos medicamentos con dosis, frecuencia y horarios
- **Mis Medicinas**: Listado de todos los medicamentos registrados con opciones de editar/eliminar
- **Historial**: Seguimiento diario de medicamentos tomados y no tomados
- **Consejos de Salud**: Recomendaciones sobre adherencia, almacenamiento y efectos secundarios
- **Almacenamiento Local**: Todos los datos se guardan localmente con AsyncStorage
- **Interfaz Intuitiva**: Diseño accesible con navegación por pestañas

## 🛠 Requisitos

- Node.js >= 20
- React Native CLI
- Android SDK (para compilación Android)
- Android Studio (para emulación)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd AppMedicamentos

# Instalar dependencias
npm install
# o
pnpm install
```

## 🚀 Ejecución

### En emulador de Android Studio

```bash
# En una terminal
npm start

# En otra terminal
npm run android
```

O directamente:
```bash
npx react-native run-android
```

## 📁 Estructura del Proyecto

```
src/
├── screens/
│   ├── HomeScreen.tsx          # Pantalla principal
│   ├── AddMedicationScreen.tsx # Agregar medicamento
│   ├── MyMedicinesScreen.tsx    # Lista de medicinas
│   ├── HistoryScreen.tsx        # Historial
│   └── TipsScreen.tsx           # Consejos de salud
├── components/
│   ├── MedicationCard.tsx       # Tarjeta de medicamento
│   ├── MedicineListItem.tsx     # Elemento de lista
│   ├── BottomTabBar.tsx         # Navegación inferior
│   ├── HistoryDateCard.tsx      # Tarjeta de actividad
│   └── TipCard.tsx              # Tarjeta de consejo
├── types/
│   └── medication.ts            # Tipos TypeScript
├── styles/
│   └── colors.ts                # Sistema de colores
└── utils/
    ├── storage.ts               # Gestión de datos
    └── adherence.ts             # Cálculos de adherencia
```

## 🎨 Diseño y Colores

- **Primario**: Azul (#1e40af)
- **Secundario**: Naranja (#ff8a00)
- **Éxito**: Verde (#10b981)
- **Error**: Rojo (#ef4444)

## 💾 Persistencia de Datos

La aplicación utiliza **AsyncStorage** para almacenar:
- **Medicamentos**: Lista de medicamentos activos
- **Historial**: Registro de tomas diarias

## 📱 Tecnologías

- React Native 0.75.2
- TypeScript
- React Navigation 6
- AsyncStorage
- DateTimePicker
- React Native Vector Icons

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor Metro
- `npm run android` - Ejecuta en emulador Android
- `npm test` - Ejecuta tests
- `npm run lint` - Ejecuta linter

## 📝 Notas de Desarrollo

- La app está optimizada solo para **Android**
- Todos los datos se guardan localmente en el dispositivo
- No requiere backend externo
- Compatible con Android 5.0+

## 📄 Licencia

Privado

## ✅ Próximas Características

- [ ] Notificaciones push automáticas
- [ ] Sincronización con cloud
- [ ] Modo oscuro
- [ ] Gráficos de adherencia
- [ ] Exportación de reportes

---

**Versión**: 1.0.0  
**Última actualización**: 2026
