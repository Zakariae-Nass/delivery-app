import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';

export default function UrgentSection({ isUrgent, toggleUrgent, urgentScale }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Priorite</Text>
      <Animated.View style={{ transform: [{ scale: urgentScale }] }}>
        <TouchableOpacity
          style={[styles.urgentToggle, isUrgent && styles.urgentToggleActive]}
          onPress={toggleUrgent}
          activeOpacity={0.8}
        >
          <View style={styles.urgentLeft}>
            <Text style={styles.urgentIconText}>{isUrgent ? '🔴' : '⚪'}</Text>
            <View>
              <Text style={[styles.urgentTitle, isUrgent && styles.urgentTitleActive]}>
                {isUrgent ? 'Commande URGENTE' : 'Commande normale'}
              </Text>
              <Text style={styles.urgentSubtitle}>
                {isUrgent ? 'Livraison prioritaire demandee' : 'Appuyer pour marquer urgent'}
              </Text>
            </View>
          </View>
          <View style={[styles.urgentSwitch, isUrgent && styles.urgentSwitchActive]}>
            <View style={[styles.urgentThumb, isUrgent && styles.urgentThumbActive]} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },

  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    backgroundColor: '#FAFAFA',
  },
  urgentToggleActive: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF0F0',
  },
  urgentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  urgentIconText: { fontSize: 22 },
  urgentTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  urgentTitleActive: { color: COLORS.danger },
  urgentSubtitle: { fontSize: 11, color: '#999', marginTop: 2 },
  urgentSwitch: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center', padding: 3,
  },
  urgentSwitchActive: { backgroundColor: COLORS.danger },
  urgentThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2,
    elevation: 2,
  },
  urgentThumbActive: { alignSelf: 'flex-end' },
});
