import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../config/theme';

export default function StatCard({ icon, label, value, color }) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: 110,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 3,
    alignItems: 'center',
  },
  icon:  { fontSize: 22, marginBottom: Spacing.xs },
  value: { fontSize: FontSize.xl, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
});
