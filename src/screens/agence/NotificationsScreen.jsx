import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';

const BLUE = '#4361EE';
const BG   = '#F5F7FF';

const NOTIF_CONFIG = {
  driver_applied:  {
    icon: '🚴',
    title: n => `${n.driverName} a postulé pour la commande #${n.orderShortId}`,
  },
  agency_assigned: {
    icon: '✅',
    title: n => `Vous avez assigné ${n.driverName} à la commande #${n.orderShortId}`,
  },
  auto_assigned:   {
    icon: '🤖',
    title: n => `Assignation auto : ${n.driverName} → commande #${n.orderShortId}`,
  },
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `il y a ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  return `il y a ${Math.floor(m / 60)}h`;
}

function NotifCard({ notif }) {
  const cfg = NOTIF_CONFIG[notif.type] || { icon: '🔔', title: () => '' };
  return (
    <View style={[styles.card, !notif.read && styles.cardUnread]}>
      {!notif.read && <View style={styles.unreadBar} />}
      <Text style={styles.cardIcon}>{cfg.icon}</Text>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{cfg.title(notif)}</Text>
        <Text style={styles.cardTime}>{timeAgo(notif.createdAt)}</Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen({ navigation }) {
  const { notifications, markAllRead } = useApp();

  // Mark all as read when screen opens
  useEffect(() => {
    markAllRead();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotifCard notif={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  list: { padding: 16, paddingBottom: 40 },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  cardUnread: { backgroundColor: '#F0F4FF' },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: BLUE,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardIcon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', lineHeight: 20 },
  cardTime: { fontSize: 12, color: '#999', marginTop: 4 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#999', fontWeight: '500' },
});
