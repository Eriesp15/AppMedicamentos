import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, Appointment, UserContextType } from '../types';
import {
  getUser,
  saveUser,
  getAppointments,
  saveAppointment,
  deleteAppointment as deleteAppointmentFromStorage,
} from '../utils/storage';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadUser();
    loadAppointments();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const loadAppointments = async () => {
    const appointmentData = await getAppointments();
    setAppointments(appointmentData);
  };

  const updateUser = async (userData: UserProfile) => {
    await saveUser(userData);
    setUser(userData);
  };

  const addAppointment = async (appointment: Appointment) => {
    await saveAppointment(appointment);
    await loadAppointments();
  };

  const deleteAppointment = async (id: string) => {
    await deleteAppointmentFromStorage(id);
    await loadAppointments();
  };

  const value: UserContextType = {
    user,
    updateUser,
    appointments,
    addAppointment,
    deleteAppointment,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
