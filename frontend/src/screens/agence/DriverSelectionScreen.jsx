import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../config/constants';
import useDriverSelection from '../../hooks/useDriverSelection';

function StarRating({ rating }) {
  const filled = Math.min(5, Math.round(rating));
  return (
    <Text style={styles.stars}>
      {'⭐'.repeat(filled)}
      {'☆'.repeat(Math.max(0, 5 - filled))}
      {'  '}
      {rating.toFixed(1)}
    </Text>
  );
}

function DriverCard({ driver, onAssign }) {
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

export default function DriverSelectionScreen({ navigation, route }) {
  const { orderId } = route.params;
  const {
    timeLeft,
    timerText,
    isTimerUrgent,
    applicants,
    shortId,
    handleAssignDriver,
    TIMER_TOTAL,
  } = useDriverSelection(orderId, navigation);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choisir un livreur</Text>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>#{shortId}</Text>
        </View>
      </View>

      <FlatList
        data={applicants}
        keyExtractor={item => item.id}
        extraData={applicants.length}
        ListHeaderComponent={(
          <>
            <View style={styles.timerCard}>
              <Text style={[styles.timerDisplay, isTimerUrgent && styles.timerUrgent]}>
                {timerText}
              </Text>
              <Text style={styles.timerLabel}>Temps restant pour choisir</Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(timeLeft / TIMER_TOTAL) * 100}%` },
                    isTimerUrgent && { backgroundColor: COLORS.danger },
                  ]}
                />
              </View>
              {applicants.length === 0 && (
                <Text style={styles.waitingText}>En attente de livreurs...</Text>
              )}
            </View>
            {applicants.length > 0 && (
              <Text style={styles.sectionLabel}>
                {applicants.length} livreur{applicants.length > 1 ? 's' : ''} disponible{applicants.length > 1 ? 's' : ''}
              </Text>
            )}
          </>
        )}
        renderItem={({ item }) => (
          <DriverCard driver={item} onAssign={handleAssignDriver} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backBtnText: { fontSize: 26, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  orderBadge: {
    backgroundColor: COLORS.blueLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orderBadgeText: { color: COLORS.blue, fontWeight: '700', fontSize: 13 },

  list: { padding: 16, paddingBottom: 40 },

  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  timerDisplay: {
    fontSize: 58,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 4,
    marginBottom: 6,
    fontVariant: ['tabular-nums'],
  },
  timerUrgent: { color: COLORS.danger },
  timerLabel: { fontSize: 13, color: '#999', marginBottom: 18 },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: COLORS.blue,
    borderRadius: 3,
  },
  waitingText: { fontSize: 14, color: '#999', marginTop: 14 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
    marginLeft: 2,
  },

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
  stars: { fontSize: 13, marginBottom: 3 },
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
