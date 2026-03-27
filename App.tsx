import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Color Theme
const COLORS = {
  primary: '#2E5BFF',
  secondary: '#FFB300',
  success: '#00C851',
  danger: '#ff4444',
  white: '#FFFFFF',
  light: '#F5F7FA',
  gray: '#9CA3AF',
  text: '#1F2937',
  border: '#E5E7EB',
};

interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
  frequency: string;
  color: string;
  taken: boolean;
}

interface UserProfile {
  name: string;
  age: string;
  email: string;
  phone: string;
  doctor: string;
  doctorPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// Initial data
const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Aspirina',
    dose: '100mg',
    time: '08:00',
    frequency: 'Diaria',
    color: '#FFD700',
    taken: false,
  },
  {
    id: '2',
    name: 'Metformina',
    dose: '500mg',
    time: '12:00',
    frequency: 'Diaria',
    color: '#87CEEB',
    taken: true,
  },
  {
    id: '3',
    name: 'Losartán',
    dose: '50mg',
    time: '20:00',
    frequency: 'Diaria',
    color: '#FFB6C1',
    taken: false,
  },
];

const INITIAL_USER: UserProfile = {
  name: 'Juan Pérez',
  age: '65',
  email: 'juan@example.com',
  phone: '+34 912 345 678',
  doctor: 'Dr. Carlos López',
  doctorPhone: '+34 912 999 888',
  emergencyContact: 'María Pérez',
  emergencyPhone: '+34 666 777 888',
};

// Component: Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const isComplete = status === 'Tomado';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isComplete ? COLORS.success : COLORS.secondary },
      ]}
    >
      <Text style={styles.badgeText}>{isComplete ? '✓ Tomado' : 'Pendiente'}</Text>
    </View>
  );
};

// Component: Medication Card
const MedicationCard = ({
  med,
  onMarkTaken,
  onDelete,
}: {
  med: Medication;
  onMarkTaken: () => void;
  onDelete: () => void;
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: med.color, borderLeftWidth: 4 }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.medicationName}>{med.name}</Text>
          <Text style={styles.medicationDose}>{med.dose}</Text>
          <Text style={styles.medicationInfo}>
            Hora: {med.time} • Frecuencia: {med.frequency}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Text style={{ fontSize: 20 }}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <StatusBadge status={med.taken ? 'Tomado' : 'Pendiente'} />
        {!med.taken && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.success }]}
            onPress={onMarkTaken}
          >
            <Text style={styles.buttonText}>Marcar como Tomado</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Component: Bottom Tab Bar
const BottomTabBar = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = ['Inicio', 'Medicamentos', 'Horarios', 'Perfil'];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.tabActive]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={styles.tabIcon}>
            {tab === 'Inicio' && '🏠'}
            {tab === 'Medicamentos' && '💊'}
            {tab === 'Horarios' && '📅'}
            {tab === 'Perfil' && '👤'}
          </Text>
          <Text style={styles.tabLabel}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Screen: Home
const HomeScreen = ({
  medications,
  onMarkTaken,
}: {
  medications: Medication[];
  onMarkTaken: (id: string) => void;
}) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediCare</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{dateStr}</Text>
      </View>

      <Text style={styles.sectionTitle}>Medicamentos de Hoy</Text>

      {medications.map((med) => (
        <MedicationCard
          key={med.id}
          med={med}
          onMarkTaken={() => onMarkTaken(med.id)}
          onDelete={() => {}}
        />
      ))}

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.bigButton, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.bigButtonText}>+ Agregar Medicamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bigButton, { backgroundColor: COLORS.secondary }]}>
          <Text style={styles.bigButtonText}>📋 Ver Historial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Screen: Medications
const MedicationsScreen = ({
  medications,
  onDelete,
  onAddNew,
}: {
  medications: Medication[];
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) => {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediCare</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis Medicamentos</Text>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: COLORS.primary }]}
          onPress={onAddNew}
        >
          <Text style={styles.smallButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {medications.map((med) => (
        <MedicationCard
          key={med.id}
          med={med}
          onMarkTaken={() => {}}
          onDelete={() => onDelete(med.id)}
        />
      ))}
    </ScrollView>
  );
};

// Screen: Schedules
const SchedulesScreen = ({ medications }: { medications: Medication[] }) => {
  const sortedMeds = [...medications].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediCare</Text>
      </View>

      <Text style={styles.sectionTitle}>Horarios de Hoy</Text>

      {sortedMeds.map((med) => (
        <View key={med.id} style={styles.scheduleItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.timeDot,
                { backgroundColor: med.color },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleTime}>{med.time}</Text>
              <Text style={styles.scheduleMed}>
                {med.name} - {med.dose}
              </Text>
            </View>
          </View>
          <StatusBadge status={med.taken ? 'Tomado' : 'Pendiente'} />
        </View>
      ))}
    </ScrollView>
  );
};

// Screen: Profile
const ProfileScreen = ({
  user,
  onUpdateUser,
}: {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediCare</Text>
      </View>

      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{user.name}</Text>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: COLORS.primary }]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.smallButtonText}>
            {isEditing ? 'Cancelar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.form}>
          <Text style={styles.formLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Text style={styles.formLabel}>Edad</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            keyboardType="numeric"
          />

          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />

          <Text style={styles.formLabel}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />

          <Text style={styles.formLabel}>Doctor</Text>
          <TextInput
            style={styles.input}
            value={formData.doctor}
            onChangeText={(text) => setFormData({ ...formData, doctor: text })}
          />

          <Text style={styles.formLabel}>Teléfono del Doctor</Text>
          <TextInput
            style={styles.input}
            value={formData.doctorPhone}
            onChangeText={(text) => setFormData({ ...formData, doctorPhone: text })}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.success, marginTop: 16 }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Edad:</Text>
            <Text style={styles.infoValue}>{user.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Doctor:</Text>
            <Text style={styles.infoValue}>{user.doctor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono Doctor:</Text>
            <Text style={styles.infoValue}>{user.doctorPhone}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('Inicio');
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const handleMarkTaken = (id: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, taken: true } : med
      )
    );
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {activeTab === 'Inicio' && (
        <HomeScreen medications={medications} onMarkTaken={handleMarkTaken} />
      )}
      {activeTab === 'Medicamentos' && (
        <MedicationsScreen
          medications={medications}
          onDelete={handleDeleteMedication}
          onAddNew={() => {}}
        />
      )}
      {activeTab === 'Horarios' && <SchedulesScreen medications={medications} />}
      {activeTab === 'Perfil' && (
        <ProfileScreen user={user} onUpdateUser={handleUpdateUser} />
      )}

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  screen: {
    flex: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  dateContainer: {
    backgroundColor: COLORS.light,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  medicationDose: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  medicationInfo: {
    fontSize: 12,
    color: COLORS.gray,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    gap: 12,
  },
  bigButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bigButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 80,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
  },
  timeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  scheduleMed: {
    fontSize: 12,
    color: COLORS.gray,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  form: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  profileInfo: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});
