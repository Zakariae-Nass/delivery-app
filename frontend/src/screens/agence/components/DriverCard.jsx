import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../config/constants';
import StarRating from './StarRating';

export default function DriverCard({ driver, onAssign }) {
  return (
    <View style={styles.driverCard}>
      <Text style={styles.driverAvatar}>{driver.avatar}</Text>
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>{driver.name}</Text>
        <StarRating rating={driver.rating} />
        <Text style={styles.driverTrips}>{driver.trips} courses effectuees</Text>
      </View>
      <TouchableOpacity style={styles.assignBtn} onPress={() => onAssign(driver)}>
        <Text style={styles.assignBtnText}>Choisir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  driverAvatar: { fontSize: 40, marginRight: 14 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 3 },
  driverTrips: { fontSize: 12, color: '#999' },
  assignBtn: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: COLORS.blue,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  assignBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
