import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';

const BLUE   = '#4361EE';
const DANGER = '#E63946';
const BG     = '#F5F7FF';

const TIMER_TOTAL = 120; // seconds

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
        <Text style={styles.driverTrips}>{driver.trips} courses effectuées</Text>
      </View>
      <TouchableOpacity style={styles.assignBtn} onPress={() => onAssign(driver)}>
        <Text style={styles.assignBtnText}>Choisir</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DriverSelectionScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { orders, updateOrder, addNotification } = useApp();

  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL);
  const hasAssigned = useRef(false);

  // Live order from context — updates as simulation adds applicants
  const order = orders.find(o => o.id === orderId);
  const orderRef = useRef(order);
  orderRef.current = order; // always up-to-date inside effects

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-assign when timer expires ─────────────────────────────────────────
  useEffect(() => {
    if (timeLeft !== 0 || hasAssigned.current) return;
    hasAssigned.current = true;

    const currentOrder = orderRef.current;
    if (!currentOrder?.applicants?.length) {
      navigation.navigate('OrdersList');
      return;
    }
    const driver = currentOrder.applicants.reduce((best, d) =>
      d.rating > best.rating ? d : best
    );

    updateOrder(orderId, { statut: 'Assigné', assignedDriver: driver });
    addNotification({
      id: Date.now().toString(),
      orderId,
      orderShortId: orderId.slice(-4),
      type: 'auto_assigned',
      driverName: driver.name,
      driverId: driver.id,
      read: false,
      createdAt: new Date(),
    });
    Alert.alert(
      '🤖 Assignation automatique',
      `Délai expiré. ${driver.name} (⭐ ${driver.rating}) a été automatiquement assigné.`,
      [{ text: 'OK', onPress: () => navigation.navigate('OrdersList') }]
    );
  }, [timeLeft]);

  // ── Manual assign ──────────────────────────────────────────────────────────
  const handleAssignDriver = (driver) => {
    if (hasAssigned.current) return;
    hasAssigned.current = true;

    updateOrder(orderId, { statut: 'Assigné', assignedDriver: driver });
    addNotification({
      id: Date.now().toString(),
      orderId,
      orderShortId: orderId.slice(-4),
      type: 'agency_assigned',
      driverName: driver.name,
      driverId: driver.id,
      read: false,
      createdAt: new Date(),
    });
    Alert.alert(
      '✅ Livreur assigné',
      `${driver.name} a été notifié et va prendre en charge la commande.`,
      [
        {
          text: '🗺️ Voir la navigation',
          onPress: () => navigation.navigate('Navigation', { orderId }),
        },
        {
          text: 'Retour aux commandes',
          style: 'cancel',
          onPress: () => navigation.navigate('OrdersList'),
        },
      ]
    );
  };

  const minutes    = Math.floor(timeLeft / 60);
  const seconds    = timeLeft % 60;
  const timerText  = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent   = timeLeft < 30 && timeLeft > 0;
  const applicants = order?.applicants || [];
  const shortId    = orderId.slice(-4);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
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
        extraData={applicants.length} // re-render when new applicants arrive
        ListHeaderComponent={(
          <>
            {/* TIMER CARD */}
            <View style={styles.timerCard}>
              <Text style={[styles.timerDisplay, isUrgent && styles.timerUrgent]}>
                {timerText}
              </Text>
              <Text style={styles.timerLabel}>Temps restant pour choisir</Text>

              {/* Linear progress bar */}
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(timeLeft / TIMER_TOTAL) * 100}%` },
                    isUrgent && { backgroundColor: DANGER },
                  ]}
                />
              </View>

              {applicants.length === 0 && (
                <Text style={styles.waitingText}>⏳ En attente de livreurs...</Text>
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
    backgroundColor: '#EEF1FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orderBadgeText: { color: BLUE, fontWeight: '700', fontSize: 13 },

  list: { padding: 16, paddingBottom: 40 },

  // Timer
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
  timerUrgent: { color: DANGER },
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
    backgroundColor: BLUE,
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

  // Driver card
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
    backgroundColor: BLUE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  assignBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
