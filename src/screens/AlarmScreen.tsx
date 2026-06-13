import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, Vibration, Dimensions } from 'react-native';
import { ALARM_SOUND_OPTIONS } from '../constants/data';
import { AlarmSoundId } from '../types/medication';

export type AlarmScreenData = {
  notificationId?: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  dosage: string;
  snoozeMinutes: number;
  alarmSound: AlarmSoundId;
};

type Props = {
  alarm: AlarmScreenData | null;
  onDismiss: () => void;
  onTaken: (data: AlarmScreenData) => void;
  onSnooze: (data: AlarmScreenData) => void;
};

const { width, height } = Dimensions.get('window');

export function AlarmScreen({ alarm, onDismiss, onTaken, onSnooze }: Props) {
  useEffect(() => {
    if (alarm) {
      Vibration.vibrate([0, 500, 200, 500, 200, 500], true);
    }
    return () => Vibration.cancel();
  }, [alarm]);

  if (!alarm) return null;

  const sound = ALARM_SOUND_OPTIONS.find(s => s.id === alarm.alarmSound);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: '#1A1A2E',
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        paddingTop: 60,
      }}>
        <Text style={{
          fontSize: 56,
          fontWeight: '300',
          color: '#FFF',
          marginBottom: 8,
        }}>
          {alarm.scheduledTime}
        </Text>

        <Text style={{
          fontSize: 32,
          fontWeight: '600',
          color: '#FFF',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          {alarm.medicationName}
        </Text>

        <Text style={{
          fontSize: 20,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          {alarm.dosage}
        </Text>

        {sound && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            marginBottom: 40,
          }}>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.5)',
            }}>
              Tono: {sound.label}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50',
            paddingVertical: 18,
            paddingHorizontal: 64,
            borderRadius: 16,
            marginBottom: 16,
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => onTaken(alarm)}
        >
          <Text style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#FFF',
          }}>
            Tomado
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            paddingVertical: 16,
            paddingHorizontal: 48,
            borderRadius: 16,
            marginBottom: 12,
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => onSnooze(alarm)}
        >
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#FFF',
          }}>
            Posponer {alarm.snoozeMinutes} min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 32,
          }}
          onPress={onDismiss}
        >
          <Text style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.4)',
          }}>
            Descartar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
