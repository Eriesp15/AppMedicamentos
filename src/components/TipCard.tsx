import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../styles/colors';

interface TipCardProps {
  tip: {
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

export default function TipCard({ tip, index }: TipCardProps) {
  const colors = [
    { bg: '#FFF5E6', borderLeft: Colors.orange },
    { bg: '#E6F3FF', borderLeft: Colors.primary },
    { bg: '#FFE6E6', borderLeft: Colors.error },
    { bg: '#E6FFE6', borderLeft: Colors.success },
    { bg: '#F3E6FF', borderLeft: '#9333EA' },
    { bg: '#E6FFF7', borderLeft: '#10B981' },
  ];

  const colorScheme = colors[index % colors.length];

  return (
    <View style={[
      styles.card,
      { backgroundColor: colorScheme.bg, borderLeftColor: colorScheme.borderLeft },
    ]}>
      <Text style={styles.icon}>{tip.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.description}>{tip.description}</Text>
      </View>
      <TouchableOpacity style={styles.readMore} activeOpacity={0.7}>
        <Text style={styles.readMoreText}>Leer más</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  icon: {
    fontSize: 28,
    marginBottom: 12,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  readMore: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
});
