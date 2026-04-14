import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_CONFIG } from '../config/constants';

export default function StatusBadge({ statut }) {
  const cfg = STATUS_CONFIG[statut] || STATUS_CONFIG['En attente'];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.color }]}>{statut}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
