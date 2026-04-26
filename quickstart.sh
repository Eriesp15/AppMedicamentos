#!/bin/bash
# Quick Start Script para MediCare

echo "🚀 MediCare - Quick Start"
echo "========================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""
echo "✅ Instalación completada!"
echo ""
echo "Para ejecutar la app:"
echo ""
echo "  Terminal 1:"
echo "  $ npm start"
echo ""
echo "  Terminal 2 (después de que Metro bundler esté listo):"
echo "  $ npm run android"
echo ""
echo "O en una sola línea:"
echo "  $ npx react-native run-android"
echo ""
echo "Asegúrate de tener:"
echo "  ✓ Android Studio instalado"
echo "  ✓ Un emulador virtual (AVD) corriendo"
echo "  ✓ Android SDK configurado"
echo ""
echo "📚 Documentación:"
echo "  - README.md - Información general"
echo "  - DEVELOPMENT.md - Guía de desarrollo"
echo "  - BUILD_SUMMARY.md - Resumen de cambios"
echo ""
