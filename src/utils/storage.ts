import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, Activity } from '../types/medication';
import { useState, useEffect } from 'react';

const MEDICATIONS_KEY = 'app_medications';
const ACTIVITY_KEY = 'app_activity';

export function useMedicationStorage() {
  const [medications, setMedications] = useState<Medication[]>([]);

  // Load medications on mount
  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const data = await AsyncStorage.getItem(MEDICATIONS_KEY);
      if (data) {
        setMedications(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const addMedication = async (medication: Medication) => {
    try {
      const updatedMeds = [...medications, medication];
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updatedMeds));
      setMedications(updatedMeds);
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  };

  const updateMedication = async (medication: Medication) => {
    try {
      const updatedMeds = medications.map((m) =>
        m.id === medication.id ? medication : m
      );
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updatedMeds));
      setMedications(updatedMeds);
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  };

  const deleteMedication = async (medicationId: string) => {
    try {
      const updatedMeds = medications.filter((m) => m.id !== medicationId);
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updatedMeds));
      setMedications(updatedMeds);
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  };

  const markTaken = async (medicationId: string) => {
    try {
      const medication = medications.find((m) => m.id === medicationId);
      if (!medication) return;

      const activity: Activity = {
        id: `${medicationId}_${Date.now()}`,
        medicationId,
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledTime: medication.startTime,
        actualTime: new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        taken: true,
        date: new Date().toISOString(),
      };

      const activities = await getActivityData();
      activities.push(activity);
      await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      throw error;
    }
  };

  const markNotTaken = async (medicationId: string) => {
    try {
      const medication = medications.find((m) => m.id === medicationId);
      if (!medication) return;

      const activity: Activity = {
        id: `${medicationId}_${Date.now()}`,
        medicationId,
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledTime: medication.startTime,
        taken: false,
        date: new Date().toISOString(),
      };

      const activities = await getActivityData();
      activities.push(activity);
      await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error marking medication as not taken:', error);
      throw error;
    }
  };

  const getActivityToday = async () => {
    try {
      const today = new Date().toDateString();
      const activities = await getActivityData();
      return activities.filter(
        (a) => new Date(a.date).toDateString() === today
      );
    } catch (error) {
      console.error('Error getting activity:', error);
      return [];
    }
  };

  const getActivityHistory = async () => {
    try {
      return await getActivityData();
    } catch (error) {
      console.error('Error getting activity history:', error);
      return [];
    }
  };

  const getActivityData = async (): Promise<Activity[]> => {
    try {
      const data = await AsyncStorage.getItem(ACTIVITY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading activity data:', error);
      return [];
    }
  };

  return {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    markTaken,
    markNotTaken,
    getActivityToday,
    getActivityHistory,
  };
}
