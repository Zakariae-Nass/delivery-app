import React from 'react';
import { View, StyleSheet } from 'react-native';
import { STATUS_CONFIG } from '../config/constants';

export default function ProgressDots({ statut }) {
  const cfg = STATUS_CONFIG[statut] || STATUS_CONFIG['En attente'];
  return (
    <View style={styles.progressRow}>
      <View style={[styles.progressDot, { backgroundColor: cfg.dots[0] ? cfg.color : '#E0E0E0' }]} />
      <View style={styles.progressLineWrapper}>
        <View style={[styles.progressLine, { backgroundColor: cfg.dots[1] ? cfg.color : '#E0E0E0' }]} />
      </View>
      <View style={[styles.progressDot, { backgroundColor: cfg.dots[1] ? cfg.color : '#E0E0E0' }]} />
      <View style={styles.progressLineWrapper}>
        <View style={[styles.progressLine, { backgroundColor: cfg.dots[2] ? cfg.color : '#E0E0E0' }]} />
      </View>
      <View style={[styles.progressDot, { backgroundColor: cfg.dots[2] ? cfg.color : '#E0E0E0' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressDot: { width: 10, height: 10, borderRadius: 5 },
  progressLineWrapper: { flex: 1, paddingHorizontal: 2 },
  progressLine: { height: 2, borderRadius: 1 },
});
