MediCare - Sistema de Gestión de Medicamentos

Descripción General
MediCare es una aplicación móvil de React Native diseñada para ayudar a usuarios (especialmente adultos mayores) a gestionar la toma de sus medicamentos diarios. La aplicación proporciona un seguimiento completo de medicamentos, horarios, historial y gestión del perfil de usuario.

Características Principales

✓ Gestión de Medicamentos: Agregar, editar y eliminar medicamentos con dosis, horarios y frecuencia
✓ Seguimiento Diario: Marcar medicamentos como tomados o pendientes
✓ Historial de Horarios: Ver historial de medicamentos por fecha
✓ Perfil de Usuario: Guardar información personal, médica y contactos de emergencia
✓ Interfaz Amigable: Diseño optimizado para adultos mayores con texto grande y colores contrastantes
✓ Persistencia Local: Todos los datos se guardan localmente en el dispositivo

Estructura del Proyecto

```
AppMedicamentos/
├── src/
│   ├── screens/              # Pantallas principales
│   │   ├── HomeScreen.tsx           # Medicamentos de hoy
│   │   ├── MedicationsScreen.tsx    # Gestión de medicamentos
│   │   ├── SchedulesScreen.tsx      # Historial de horarios
│   │   └── ProfileScreen.tsx        # Perfil del usuario
│   ├── components/           # Componentes reutilizables
│   │   ├── ActionButton.tsx         # Botón de acción
│   │   ├── StatusBadge.tsx          # Insignia de estado
│   │   ├── MedicationCard.tsx       # Tarjeta de medicamento
│   │   ├── AddEditMedicationModal.tsx # Modal para agregar/editar
│   │   └── CustomTabBar.tsx         # Barra de navegación inferior
│   ├── context/              # Context API para estado global
│   │   ├── MedicationContext.tsx    # Gestión de medicamentos
│   │   └── UserContext.tsx          # Gestión de perfil de usuario
│   ├── utils/                # Funciones de utilidad
│   │   ├── theme.ts                 # Tema y constantes de diseño
│   │   ├── dateUtils.ts             # Funciones para fechas
│   │   └── storage.ts               # Operaciones de almacenamiento
│   └── types/                # Definiciones de TypeScript
│       └── index.ts          # Interfaces y tipos
├── App.tsx                   # Componente principal con navegación
├── index.js                  # Punto de entrada de la aplicación
└── package.json              # Dependencias del proyecto

Instalación y Configuración

1. Instalar Dependencias:
   npm install
   # o
   pnpm install

2. Compilar para Android:
   react-native run-android

3. Compilar para iOS (requiere macOS):
   cd ios && pod install && cd ..
   react-native run-ios

Requisitos:
- Node.js >= 20
- React Native CLI
- Android Studio (para desarrollo en Android)
- Xcode (para desarrollo en iOS)

Pantallas y Funcionalidades

🏠 Inicio (Home)
- Muestra medicamentos del día actual
- Visualiza la fecha formateada en español
- Permite marcar medicamentos como tomados
- Acceso rápido a agregar medicamentos o ver historial

💊 Medicamentos
- Lista todos los medicamentos registrados
- Agregar nuevos medicamentos con:
  * Nombre y dosis
  * Frecuencia (diaria o días específicos)
  * Horarios de toma múltiples
  * Color de identificación
- Editar medicamentos existentes
- Eliminar medicamentos
- Buscar entre medicamentos

📅 Horarios
- Vista de horarios por fecha
- Seleccionar diferentes fechas (últimos 7 días, hoy, próximos 7 días)
- Estadísticas de cumplimiento (tomados, pendientes, total)
- Código de colores por estado

👤 Perfil
- Información personal (nombre, edad, email, teléfono)
- Información médica (médico, teléfono del médico)
- Contacto de emergencia
- Modo edición para actualizar información
- Persistencia de datos

Sistema de Colores

- Azul (#2E5BFF): Color primario, botones principales
- Verde (#00C851): Estado "Tomado", éxito
- Naranja (#FFB300): Estado "Pendiente", acciones secundarias
- Rojo (#E74C3C): Estado "No tomado", peligro
- Gris (#F5F5F5): Fondo
- Blanco (#FFFFFF): Superficie de componentes

Tecnologías Utilizadas

- React Native 0.83.0
- TypeScript 5.8.3
- React Navigation 6.x (Bottom Tabs)
- AsyncStorage para almacenamiento local
- Context API para gestión de estado
- React Native Gesture Handler
- React Native Reanimated
- React Native Vector Icons

Almacenamiento de Datos

Los datos se almacenan localmente usando AsyncStorage con las siguientes claves:

@medicare_medications    - Medicamentos registrados
@medicare_schedules     - Horarios de medicamentos
@medicare_user          - Perfil del usuario
@medicare_appointments  - Citas médicas

Estructura de Datos

Medicamento:
{
  id: string
  name: string
  dosage: string
  frequency: 'daily' | 'specific_days'
  times: string[] // Horarios (ej: "08:00")
  specificDays?: number[] // 0-6 para días específicos
  color: string
  icon: string
  notes?: string
  createdAt: number
}

Horario de Medicamento:
{
  id: string
  medicationId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  status: 'pending' | 'taken' | 'missed'
  takenAt?: number
  notes?: string
}

Perfil de Usuario:
{
  id: string
  name: string
  age: number
  email: string
  phone: string
  doctorName?: string
  doctorPhone?: string
  emergencyContact?: string
  emergencyPhone?: string
}

Próximas Mejoras

- Notificaciones push para recordatorios de medicamentos
- Vista de calendario con estadísticas mensuales
- Integración con contactos de emergencia
- Exportación de historial
- Sincronización con servidor
- Autenticación de usuario
- Multi-idioma (inglés, portugués)
- Modo oscuro

Solución de Problemas

Error: "Cannot find module '@react-navigation'"
Solución: Ejecutar npm install nuevamente

Error: "AST entry points list does not contain"
Solución: Limpiar cache - npm start --reset-cache

Los medicamentos no persisten
Solución: Verificar que AsyncStorage esté instalado correctamente

Contribución y Desarrollo

El código está organizado siguiendo principios de Clean Architecture:
- Separación de concerns (screens, components, context, utils)
- Componentes reutilizables
- Tipado fuerte con TypeScript
- Gestión centralizada de estado
- Funciones de utilidad centralizadas

Para agregar nuevas funcionalidades:
1. Crear tipos en src/types/index.ts
2. Agregar lógica a context si afecta estado global
3. Crear componentes en src/components/ si son reutilizables
4. Usar screens para pantallas específicas

Licencia
Proyecto privado - Todos los derechos reservados

Contacto y Soporte
Para reportar problemas o sugerencias, contacte al equipo de desarrollo.

Versión: 1.0.0
Última actualización: Marzo 2026
