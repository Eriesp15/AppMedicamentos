import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import TipCard from '../components/TipCard';
import { Colors } from '../styles/colors';

type TipsScreenProps = {
  navigation: any;
};

const HEALTH_TIPS = [
  {
    title: 'Beber agua con tus medicinas',
    description: 'Tomar tus medicamentos con un vaso lleno de agua ayuda a que se absorban mejor y protege tu estómago.',
    icon: '💧',
  },
  {
    title: '¡Importante!',
    description: 'Algunos medicamentos pueden causar reacciones adversas si se mezclan con alimentos o bebidas específicas.',
    icon: '⚠️',
  },
  {
    title: 'No te automediques',
    description: 'Tomar medicamentos sin receta puede ser muy peligroso. Siempre consulta a tu médico antes de tomar algo nuevo.',
    icon: '🚫',
  },
  {
    title: 'Almacenamiento seguro',
    description: 'Guarda tus medicamentos en un lugar fresco y seco, lejos de la luz solar directa y del alcance de niños.',
    icon: '🏠',
  },
  {
    title: 'Efectos secundarios',
    description: 'Si experimentas dolores de cabeza, náuseas o cualquier síntoma extraño, comunícalo a tu médico inmediatamente.',
    icon: '🩺',
  },
  {
    title: 'Adherencia al tratamiento',
    description: 'Mantener una rutina y tomar los medicamentos en los horarios prescritos es crucial para tu recuperación.',
    icon: '⏰',
  },
];

export default function TipsScreen({ navigation }: TipsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Consejos de Salud</Text>
          <Text style={styles.subtitle}>Información útil sobre medicamentos</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={styles.tabTextActive}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Medicinas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Nutrición</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Cards */}
        <View style={styles.tipsContainer}>
          {HEALTH_TIPS.map((tip, index) => (
            <TipCard key={index} tip={tip} index={index} />
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        activeTab="tips"
        onTabPress={(tab) => {
          if (tab === 'home') navigation.navigate('Home');
          if (tab === 'medicines') navigation.navigate('MyMedicines');
          if (tab === 'history') navigation.navigate('History');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  tabActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  tabTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  spacer: {
    height: 80,
  },
});
